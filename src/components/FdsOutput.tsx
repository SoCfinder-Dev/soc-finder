import { useState, useMemo } from "react";
import openTriangle from "/src/assets/openTriangle.svg";
import closedTriangle from "/src/assets/closedTriangle.svg";
import okShield from "/src/assets/okShield.svg";
import warn from "/src/assets/warn.svg";

function pluralize(string, count) {
  if (count !== 1) {
    return string
      .split(" ")
      .map((str) => str + "s")
      .join(" ");
  } else {
    return string;
  }
}

function PdfRow({ pdfObject, casCount, dangerCasCount }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const sortedCas = useMemo(
    () => pdfObject.cas.toSorted((a, b) => b.isSoc - a.isSoc),
    [pdfObject],
  );
  pdfObject.cas = sortedCas;
  const imgClass = "size-[0.75rem] self-center";
  const pSocClass = "bg-inherit text-base col-span-3 text-left flex gap-2";
  return (
    <>
      <button
        className="bg-inherit grid grid-cols-8 gap-8 cursor-pointer py-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <p className="pl-8 bg-inherit text-base text-left truncate col-span-2">
          {pdfObject.pdfFileName}
        </p>
        <p className="bg-inherit text-base col-span-2 text-left text-gray">
          {casCount} {pluralize("composant analysé", casCount)}
        </p>
        {dangerCasCount > 0 ? (
          <p className={pSocClass + " text-red"}>
            <img
              className={imgClass}
              src={warn}
            ></img>
            {dangerCasCount}{" "}
            {pluralize("substance préoccupante identifiée", dangerCasCount)}
          </p>
        ) : (
          <p className={pSocClass + " text-gray"}>
            <img
              className={imgClass}
              src={okShield}
            ></img>
            Aucune substance préoccupante
          </p>
        )}
        <div className="col-span-1 flex justify-center content-center">
          <img
            className="flex-grow-0 self-center"
            src={isExpanded ? openTriangle : closedTriangle}
          ></img>
        </div>
      </button>
      <div
        className="bg-inherit relative flex flex-col gap-2"
        hidden={!isExpanded}
      >
        {pdfObject.cas.length === 0 && (
          <div
            className="grid grid-cols-8 gap-8"
          >
            <p className="pl-8 bg-inherit text-base truncate col-span-2">
              -
            </p>
            <p
              className="bg-inherit text-base col-span-2 truncate text-left"
            >
              -
            </p>
            <p className="bg-inherit text-base col-span-2 text-gray">-</p>
            <div className="col-span-1"></div>
          </div>

            )}
        {pdfObject.cas.map((singleCas, i) => (
          <div
            className="grid grid-cols-8 gap-8"
            key={i}
          >
            <p className="pl-8 bg-inherit text-base truncate col-span-2">
              CAS: {singleCas.casId}
            </p>
            <p
              className={`bg-inherit text-base col-span-2 truncate \
                          text-left ${singleCas.casName == "-" ? "text-gray" : ""}`}
            >
              {singleCas.casName}
            </p>
            {singleCas.isSoc ? (
              <p className="bg-inherit text-base col-span-2 text-red flex gap-2">
                <img
                  className={imgClass}
                  src={warn}
                ></img>{" "}
                SOC
              </p>
            ) : (
              <p className="bg-inherit text-base col-span-2 text-gray">-</p>
            )}
            <div className="col-span-1"></div>
          </div>
        ))}
      </div>
    </>
  );
}

function FdsOutput({ pdfObjects, goBackHome }) {
  const casCounts = useMemo(
    () => pdfObjects.map((pdfObject) => pdfObject.cas.length),
    [pdfObjects],
  );
  const dangerCasCounts = useMemo(
    () =>
      pdfObjects.map(
        (pdfObject) => pdfObject.cas.filter((cas) => cas.isSoc).length,
      ),
    [pdfObjects],
  );

  const casCount = casCounts.reduce((acc, cur) => acc + cur, 0);
  const dangerCasCount = dangerCasCounts.reduce((acc, cur) => acc + cur, 0);

  return (
    <div className="mx-auto max-w-8/10 px-2 sm:px-6 lg:px-8 flex flex-col gap-4">
      <p className="text-3xl font-bold pb-4">Vos résultats</p>
      <div
        className={`bg-white relative flex justify-around gap-2 w-5xl overflow-hidden rounded-md \
                         self-center px-3 py-[0.63rem]`}
      >
        <div className="flex gap-1">
          <p className="font-bold">{pdfObjects.length}</p>
          <p>FDS {pluralize("chargée", pdfObjects.length)}</p>
        </div>
        <div>
          <div className="relative bottom-0 left-0 top-1/4 h-1/2 w-px bg-gray"></div>
        </div>
        <div className="flex gap-1 justify-center">
          <p className="font-bold">{casCount}</p>
          <p>{pluralize("composant analysé", casCount)}</p>
        </div>
        <div>
          <div className="relative bottom-0 left-0 top-1/4 h-1/2 w-px bg-gray"></div>
        </div>
        <div className="flex gap-1 justify-end">
          <p className="font-bold">{dangerCasCount}</p>
          <p>
            {pluralize("substance préoccupante identifiée", dangerCasCount)}
          </p>
        </div>
      </div>
      <div className="bg-white relative flex flex-col gap-2 w-5xl overflow-hidden rounded-md py-4 self-center">
        {pdfObjects.map((pdfObject, i) => (
          <PdfRow
            pdfObject={pdfObject}
            casCount={casCounts[i]}
            dangerCasCount={dangerCasCounts[i]}
            key={i}
          />
        ))}
      </div>
      <button
        className={`self-center mt-8 border-[0.5px] border-gray rounded-md \
                            px-[0.63rem] py-[0.38rem] cursor-pointer text-sm`}
        onClick={goBackHome}
      >
        Ajouter de nouvelles FDS
      </button>
    </div>
  );
}

export default FdsOutput;
