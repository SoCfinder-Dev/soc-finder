import { useRef, useState } from "react";
import check from "/src/assets/check.svg";
import searchIcon from "/src/assets/searchIcon.svg";
import cross from "/src/assets/cross.svg";
import clipboard from "/src/assets/clipboard.svg";

function handleDrop(
  event,
  setIsDragEnter,
  handleFilesChange,
  setIsIncorrectType,
) {
  setIsDragEnter(false);
  event.stopPropagation();
  event.preventDefault();

  let incorrect = false;
  const toAdd = [];

  for (const item of event.dataTransfer.items) {
    if (item.type == "application/pdf") {
      toAdd.push(item.getAsFile());
    }
  }

  handleFilesChange(toAdd);
}

function PdfSelecter({ handleFilesChange, setStatus }) {
  const [isDragEnter, setIsDragEnter] = useState(false);

  let ref = useRef(null);

  return (
    <div
      className={`bg-white w-4xl flex flex-col items-center gap-4\
                       justify-between pt-8 pb-4 rounded-md border-1 \
                       ${isDragEnter ? "border-sky-500" : "border-dashed border-gray"}`}
      onDragEnter={(e) => setIsDragEnter(true)}
      onDragLeave={(e) => setIsDragEnter(false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        setStatus("processing");
        handleDrop(e, setIsDragEnter, handleFilesChange, setIsIncorrectType);
      }}
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
          setStatus("processing");
          handleFilesChange([...e.target.files]);
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
    </div>
  );
}

export default PdfSelecter;
