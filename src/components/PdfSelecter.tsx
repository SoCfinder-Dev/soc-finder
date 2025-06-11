import { useRef, useState } from "react";
import check from "/src/assets/check.svg";
import searchIcon from "/src/assets/searchIcon.svg";
import cross from "/src/assets/cross.svg";
import clipboard from "/src/assets/clipboard.svg";

function handleDrop(event, setIsDragEnter, addToUserPdfs, setIsIncorrectType) {
  setIsDragEnter(false);
  event.stopPropagation();
  event.preventDefault();

  let incorrect = false;
  const toAdd = [];

  for (const item of event.dataTransfer.items) {
    if (item.type !== "application/pdf") {
      incorrect = true;
    } else {
      toAdd.push(item.getAsFile());
    }
  }

  addToUserPdfs(toAdd);
  setIsIncorrectType(incorrect);
}

function PdfSelecter({ handleFilesChange, setStatus }) {
  const [isDragEnter, setIsDragEnter] = useState(false);
  const [userPdfs, setUserPdfs] = useState([]);
  const [isIncorrectType, setIsIncorrectType] = useState(false);

  let ref = useRef(null);

  return (
    <div
      className={`bg-white w-4xl flex flex-col items-center gap-4\
                       justify-between pt-8 pb-4 rounded-md border-1 \
                       ${isDragEnter ? "border-sky-500" : "border-dashed border-gray"}`}
      onDragEnter={(e) => setIsDragEnter(true)}
      onDragLeave={(e) => setIsDragEnter(false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) =>
        handleDrop(
          e,
          setIsDragEnter,
          (pdf) => setUserPdfs([...userPdfs, ...pdf]),
          setIsIncorrectType,
        )
      }
    >
      <h2 className="text-2xl">Glissez et déposez vos FDS</h2>
      <input
        name="fds"
        type="file"
        className="opacity-0 w-[0.1px] h-[0.1px] absolute"
        ref={ref}
        accept=".pdf"
        multiple
        onChange={(e) => {
          setUserPdfs([...e.target.files]);
        }}
      />
      <button
        onClick={() => ref.current.click()}
        className={`flex justify-center gap-1 px-3 cursor-pointer \
                      border-[0.5px] border-gray rounded-md items-center \
                      hover:bg-faded-gray transition-colors`}
      >
        <img src={clipboard}></img>
        <p className="text-sm pt-[2px]">Ajoutez vos FDS</p>
      </button>
      {isIncorrectType && (
        <p className="text-red">
          Un des fichiers transférés n'est pas au format PDF
        </p>
      )}
      {userPdfs.length != 0 && (
        <>
          <div className="self-stretch px-16 flex flex-wrap items-center">
            {userPdfs.map((pdf, i) => (
              <button
                className={`flex gap-1 py-1 px-2 rounded-md cursor-pointer basis-1/2`}
                onClick={() => setUserPdfs(userPdfs.toSpliced(i, 1))}
                key={i}
              >
                <img src={cross}></img>
                <p className="text-xs truncate">{pdf.name}</p>
              </button>
            ))}
          </div>
          <button
            className={`flex flex-grow items-center gap-[0.38rem] py-1 px-2 \
            content-center border-[0.5px] border-gray rounded-md \
            cursor-pointer hover:bg-faded-gray \
            transition-colors`}
            onClick={() => {
              setStatus("processing");
              handleFilesChange(userPdfs);
            }}
          >
            <img
              src={searchIcon}
              className=""
            ></img>
            <p className="text-nowrap text-sm pt-[2px]">Lancer la recherche</p>
          </button>
        </>
      )}
    </div>
  );
}

export default PdfSelecter;
