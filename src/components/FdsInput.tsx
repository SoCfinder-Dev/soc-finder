import { useState, useCallback } from "react";
import PdfSelecter from "/src/components/PdfSelecter";
import ProcessingWidget from "/src/components/ProcessingWidget";

import checkboard from "/src/assets/checkboard.svg";
import cross from "/src/assets/cross.svg";
import warn from "/src/assets/warn.svg";
import searchIcon from "/src/assets/searchIcon.svg";
import clipboard from "/src/assets/clipboard.svg";
import imgPreview from "/src/assets/imgPreview.png";
import zzsLogo from "/src/assets/zzsLogo.svg";
import anchorImg from "/src/assets/anchorImg.svg";
import linkedinLogo from "/src/assets/linkedinLogo.svg";

function FdsInput({ handleFilesChange, nbSoc, status, setStatus }) {
  return (
    <div className="flex flex-col gap-10 content-center">
      <div className="pb-35">
        <div className="flex flex-col mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 mt-32 gap-10 content-center flex-wrap">
          <div className="flex flex-col w-2xl gap-[0.65rem] self-center">
            <h1 className="text-[2.5rem] leading-[2.8125rem] text-center font-bold">
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
          {status === "choosing" && (
            <PdfSelecter
              handleFilesChange={handleFilesChange}
              setStatus={setStatus}
            />
          )}
          {(status === "processing" || status === "processed") && (
            <ProcessingWidget
              status={status}
              setStatus={setStatus}
            />
          )}
        </div>
      </div>
      <div className="flex justify-center items-center">
        <img
          className="w-6xl h-xl"
          src={imgPreview}
        ></img>
      </div>
      <div className="flex gap-5 justify-center pt-48 pb-8">
        <img
          src={zzsLogo}
          className="w-16 h-15"
        ></img>
        <p className="text-sm/4.5 w-3xs">
          Outil basé sur le travail remarquable du RIVM, pour la compilation des
          nombreuses substances préoccupantes identifiées dans les listes des
          conventions internationales et cadres juridiques applicables en
          Europe.
        </p>
      </div>
      <div className="flex flex-col items-center gap-4 pb-36">
        <p className="text-sm/4 font-semibold">Sources :</p>
        <div className="flex gap-6 items-center pb-75">
          <a
            target="_blank"
            href="https://www.ospar.org/work-areas/hasec/hazardous-substances/possible-concern"
            className={`flex flex-nowrap gap-2 py-1 px-2 border-[0.5px] \
                border-gray rounded-md items-center cursor-pointer hover:bg-faded-gray \
                transition-colors`}
          >
            <p className="text-sm/4 text-nowrap min-w-0 pt-[2px] flex-1">
              Convention OSPAR
            </p>
            <img
              className="w-4"
              src={anchorImg}
            ></img>
          </a>
          <a
            target="_blank"
            href="https://eur-lex.europa.eu/eli/reg/2008/1272/oj?locale=fr"
            className={`flex flex-nowrap gap-2 py-1 px-2 border-[0.5px] \
                border-gray rounded-md items-center cursor-pointer hover:bg-faded-gray \
                transition-colors`}
          >
            <p className="text-sm/4 text-nowrap min-w-0 pt-[2px] flex-1">
              Règlement (CE) n° 1272/2008
            </p>
            <img
              className="w-4"
              src={anchorImg}
            ></img>
          </a>
          <a
            target="_blank"
            href="https://eur-lex.europa.eu/legal-content/FR/ALL/?uri=CELEX%3A32019R1021"
            className={`flex flex-nowrap gap-2 py-1 px-2 border-[0.5px] \
                border-gray rounded-md items-center cursor-pointer hover:bg-faded-gray \
                transition-colors`}
          >
            <p className="text-sm/4 text-nowrap min-w-0 pt-[2px] flex-1">
              POP EU
            </p>
            <img
              className="w-4"
              src={anchorImg}
            ></img>
          </a>
          <a
            target="_blank"
            href="https://environment.ec.europa.eu/topics/water/surface-water_en"
            className={`flex flex-nowrap gap-2 py-1 px-2 border-[0.5px] \
                border-gray rounded-md items-center cursor-pointer hover:bg-faded-gray \
                transition-colors`}
          >
            <p className="text-sm/4 text-nowrap min-w-0 pt-[2px] flex-1">
              KRW 2000/60/EG
            </p>
            <img
              className="w-4"
              src={anchorImg}
            ></img>
          </a>
          <a
            target="_blank"
            href="https://rvs.rivm.nl/onderwerpen/zeer-zorgwekkende-stoffen"
            className={`flex flex-nowrap gap-2 py-1 px-2 border-[0.5px] \
                border-gray rounded-md items-center cursor-pointer hover:bg-faded-gray \
                transition-colors`}
          >
            <p className="text-sm/4 text-nowrap min-w-0 pt-[2px] flex-1">
              ZZS RIVM
            </p>
            <img
              className="w-4"
              src={anchorImg}
            ></img>
          </a>
        </div>
        <a
          target="_blank"
          href="https://www.linkedin.com/company/soc-finder/"
          className={`flex flex-nowrap gap-2 py-1 px-2.5 border-[0.5px] \
            border-gray rounded-md items-center cursor-pointer hover:bg-faded-gray \
                transition-colors`}
        >
          <img
            className="leading-4.5 w-3"
            src={linkedinLogo}
          ></img>
          <p className="text-sm/4 text-nowrap min-w-0 pt-[2px] flex-1">
            Suivez-nous sur LinkedIn
          </p>
        </a>
      </div>
    </div>
  );
}

export default FdsInput;
