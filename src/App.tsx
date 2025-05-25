import { useState, useEffect } from "react";
import XLSX from "xlsx";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";
import "./App.css";

import { getSocName } from "./requests.tsx";
import Header from "./components/Header";
import FdsInput from "./components/FdsInput";
import FdsOutput from "./components/FdsOutput";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

function App() {
  // CAS number list of SoC substances to warn user about
  const [dangerCas, setDangerCas] = useState(new Set());
  // list of cas number extracted from user pdf(s)
  const [pdfObjects, setPdfObjects] = useState([]);
  // 1. choosing / 2. processing / 3. processed / 4. advanced
  const [status, setStatus] = useState("choosing");

  function conditionalAddToCas(potentialCas, str) {
    const found = str.match(/\d{2,6}[-—]\d{2}[-—]\d/);
    if (found != null) {
      found.forEach((match) => {
        const matchIndex = str.indexOf(match);
        // longer - separated numbers can fool the cas regex
        // eg: 603-073-00-2 will match 073-00-2
        // also bigger number range than {2,6}
        // maybe would need to do the same for end
        // this is done to prevent that
        if (
          matchIndex == 0 ||
          "-—0123456789".indexOf(str.charAt(matchIndex - 1)) == -1
        ) {
          potentialCas.add(match);
        }
      });
    }
  }

  // Cas search start from section 3
  function isStartingPoint(str) {
    const startRegex = /(rubrique|section).*?(?<!\d)3\b/i;
    return startRegex.test(str);
  }

  // Cas search go up to section 4
  function isEndingPoint(str) {
    const endRegex = /(rubrique|section).*?(?<!\d)4\b/i;
    return endRegex.test(str);
  }

  // Find every CAS that are in pdf, CAS are searched up to bottom,
  // line by line, using regexes 
  // This method can causes problems with certain pdfs types:
  //  1. Line wrap during CAS number
  //  2. One of "-—0123456789" just before the CAS number
  // Maybe other bad cases not found yet
  async function findCasInPdf(pdf) {
    let potentialCas = new Set();
    let startingPoint = false,
      endingPoint = false;
    for (let i = 1; i < pdf._pdfInfo.numPages && !endingPoint; i++) {
      const page = await pdf.getPage(i);
      const contents = await page.getTextContent();
      // sort items by descending y order
      // basically sorting them from top to bottom in reading terms
      contents.items.sort((a, b) => {
        return b.transform[5] - a.transform[5];
      });
      let curY = contents.items[0]?.transform[5];
      let curStr = "";
      for (const content of contents.items) {
        // process elements line by line, with a error margin of 5
        if (
          content.transform[5] <= curY + 5 &&
          content.transform[5] >= curY - 5
        ) {
          curStr += content.str;
        } else {
          startingPoint ||= isStartingPoint(curStr);
          // we only search cas starting from section 3
          if (startingPoint) {
            conditionalAddToCas(potentialCas, curStr);
            endingPoint ||= isEndingPoint(curStr);
          }
          // we do not search cas after section 4
          if (endingPoint) {
            break;
          }
          // parameters to loop next line
          curStr = content.str;
          curY = content.transform[5];
        }
      }
    }
    return potentialCas;
  }

  async function processPdf(e, file) {
    const loadingTask = pdfjsLib.getDocument(e.target.result);
    const pdf = await loadingTask.promise;
    const pdfObject = {
      pdfFileName: file.name,
      cas: [],
      socNb: 0,
    };
    const casNumbers = await findCasInPdf(pdf);
    casNumbers.forEach((cas) => {
      const casObject = {
        casId: cas,
        casName: "", // To be filled by API
        isSoc: dangerCas.has(cas),
      };
      pdfObject.socNb += dangerCas.has(cas);
      pdfObject.cas.push(casObject);
    });
    return pdfObject;
  }

  function readPdfFile(file, pdfObjects) {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      const promises = []; // when they say promises, they mean promises...
      // the closure is here to access file name from loadend event
      reader.onloadend = ((file) => {
        return (e) => {
          processPdf(e, file).then((pdfObject) => {
            // get cas name from cas registry
            pdfObject.cas.forEach((cas) => {
              promises.push(
                getSocName(cas.casId).then((response) => {
                  cas.casName = response.name;
                }),
              );
            });
            Promise.all(promises).then(() => {
              pdfObjects.push(pdfObject);
              res();
            });
          });
        };
      })(file);
      reader.onerror = (error) => {
        rej(error);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  function searchCasInPdfs(files) {
    const pdfObjects = [];
    const promises = [];
    Object.keys(files).forEach((i) => {
      promises.push(readPdfFile(files[i], pdfObjects));
    });
    Promise.all(promises).then(() => {
      pdfObjects.sort((a, b) => b.socNb - a.socNb);
      setPdfObjects(pdfObjects);
      setStatus("processed");
      console.log(pdfObjects) // left intentionally for logging purposes
    });
  }

  function handleFilesChange(files) {
    setPdfObjects([]);
    searchCasInPdfs(files);
  }

  function resetToHome() {
    setPdfObjects([]);
    setStatus("choosing");
  }

  useEffect(() => {
    let isCancelled = false;
    const fetchList = async () => {
      const data = await (
        await fetch("./DownloadTotaleLijst.xlsx")
      ).arrayBuffer();
      const workbook = XLSX.read(data, { dense: true });
      let dangerCas = new Set();
      for (let i = 1; i < workbook.Sheets.Sheet1["!data"].length; i++) {
        // filter everything that is not a CAS number on the first col of
        // the spreadsheet
        if (
          !isNaN(parseInt(workbook.Sheets.Sheet1["!data"][i][0].v.charAt(0)))
        ) {
          dangerCas.add(workbook.Sheets.Sheet1["!data"][i][0].v);
        }
      }
      if (!isCancelled) {
        setDangerCas(dangerCas);
      }
    };
    fetchList();
    return () => {
      isCancelled = true;
    };
  }, []);

  if (status === "advanced") {
    return (
      <>
        <Header goBackHome={resetToHome} />
        <FdsOutput
          pdfObjects={pdfObjects}
          goBackHome={resetToHome}
        />
      </>
    );
  } else {
    return (
      <>
        <Header goBackHome={null} />
        <FdsInput
          handleFilesChange={handleFilesChange}
          nbSoc={dangerCas.size}
          status={status}
          setStatus={setStatus}
        />
      </>
    );
  }
}

export default App;
