import { useState, useRef } from "react";
import checkboard from "/src/assets/checkboard.svg";
import clipboard from "/src/assets/clipboard.svg";
import check from "/src/assets/check.svg";

function FdsInput({ handleFilesChange, nbSoc, status, setStatus }) {
  let ref = useRef(null);

  return (
    <div className="flex flex-col mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 mt-32 gap-32 content-center flex-wrap">
      <div className="flex flex-col w-2xl gap-[0.65rem] self-center">
        <h1 className="text-4xl text-center font-bold">
          Vérifiez l’absence de substances préoccupantes dans vos FDS
        </h1>
        <div className="flex justify-center items-center gap-1">
          <img
            className="object-none"
            src={checkboard}
          ></img>
          <p className="text-sm pt-[1px]">
            {nbSoc} SoC évaluées, en quelques secondes
          </p>
        </div>
      </div>
      <div
        className={`bg-white w-4xl flex flex-col items-center gap-4\
                       justify-between pt-8 pb-4 rounded-md border-1 border-dashed border-gray`}
      >
        <h2 className="text-2xl">Glissez et déposez vos FDS</h2>
        <button
          onClick={() => ref.current.click()}
          className={`flex justify-center gap-1 px-3 cursor-pointer \
                      border-[0.5px] border-gray rounded-md items-center \
                      hover:bg-faded-gray transition-colors`}
        >
          <img src={clipboard}></img>
          <p className="text-sm pt-[2px]">Ajoutez vos FDS</p>
        </button>
        <input
          name="fds"
          type="file"
          className="opacity-0 w-[0.1px] h-[0.1px] absolute"
          ref={ref}
          accept=".pdf"
          multiple
          onChange={(e) => {
            setStatus("processing");
            handleFilesChange(e.target.files);
          }}
        />
        {status === "processing" ? (
          <div>
            <svg
              aria-hidden="true"
              class="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-[#2c2421]"
              viewBox="0 0 100 101"
              fill="none"
            >
              <path
                d={`M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 \
              100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 \
              0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 \
              27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 \
              50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 \
              9.08144 27.9921 9.08144 50.5908Z`}
                fill="currentColor"
              />
              <path
                d={`M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 \
              33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 \
              15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 \
              63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 \
              41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 \
              9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 \
              9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 \
              15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 \
              28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 \
              39.6781 93.9676 39.0409Z`}
                fill="currentFill"
              />
            </svg>
          </div>
        ) : null}
        {status === "processed" ? (
          <div className="flex flex-auto items-center">
            <p className="font-bold text-sm leading-none">
              Votre analyse est prête
            </p>
            <div className="px-4"></div>
            <button
              className={`flex flex-grow items-center gap-[0.38rem] py-1 px-2 \
            content-center border-[0.5px] border-green rounded-md \
            bg-faded-green text-green cursor-pointer hover:bg-vfaded-green \
            transition-colors`}
              onClick={() => setStatus("advanced")}
            >
              <img
                src={check}
                className="size-[12px]"
              ></img>
              <p className="text-sm text-nowrap pt-[2px]">Voir les résultats</p>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default FdsInput;
