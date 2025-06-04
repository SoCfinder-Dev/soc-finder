import { useState, useEffect } from "react";
import openTriangle from "/src/assets/openTriangle.svg";
import closedTriangle from "/src/assets/closedTriangle.svg";
import okShield from "/src/assets/okShield.svg";
import warn from "/src/assets/warn.svg";
import { providerNames } from "../socSources.tsx";
import SidePanel from "./SidePanel";

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

function toggleMapItem(map, setMap, id) {
  setMap(new Map([...map]).set(id, !map.get(id)));
}

function PdfRow({
  pdfObject,
  casCount,
  dangerCasCount,
  isExpanded,
  toggleExpanded,
}) {
  const sortedCas = pdfObject.cas.toSorted((a, b) => b.isSoc - a.isSoc);
  pdfObject.cas = sortedCas;
  const imgClass = "size-[0.75rem] self-center";
  const pSocClass =
    "bg-inherit transition-[inherit] text-sm col-span-3 text-left flex gap-2";
  return (
    <>
      <button
        className={`bg-inherit grid grid-cols-8 gap-8 cursor-pointer py-2 \
        rounded-md hover:bg-stone transition-colors`}
        onClick={toggleExpanded}
      >
        <p className="pl-4 bg-inherit transition-[inherit] text-sm text-left truncate col-span-2">
          {pdfObject.pdfFileName}
        </p>
        <p className="bg-inherit transition-[inherit] text-sm col-span-2 text-left text-gray">
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
        <div className="col-span-1 flex justify-center content-center transition-[inherit]">
          <img
            className="flex-grow-0 self-center"
            src={isExpanded ? openTriangle : closedTriangle}
          ></img>
        </div>
      </button>
      <div
        className="bg-inherit transition-[inherit] relative flex flex-col gap-1"
        hidden={!isExpanded}
      >
        {pdfObject.cas.length === 0 && (
          <div className="grid grid-cols-8 gap-8">
            <p className="pl-4 bg-inherit transition-[inherit] text-sm truncate col-span-2">
              -
            </p>
            <p className="bg-inherit transition-[inherit] text-sm col-span-2 truncate text-left">
              -
            </p>
            <div className="bg-inherit transition-[inherit] col-span-3 grid grid-cols-5 gap-3">
              <p className="bg-inherit transition-[inherit] text-sm col-span-1 text-gray">
                -
              </p>
              <p className="bg-inherit transition-[inherit] text-sm col-span-4 text-gray">
                -
              </p>
            </div>
          </div>
        )}
        {pdfObject.cas.map((singleCas, i) => (
          <div
            className="grid grid-cols-8 gap-8"
            key={i}
          >
            <p className="pl-4 bg-inherit text-sm truncate col-span-2">
              CAS: {singleCas.casId}
            </p>
            <p
              className={`bg-inherit text-sm col-span-2 truncate \
                          text-left ${singleCas.casName == "-" ? "text-gray" : ""}`}
            >
              {singleCas.casName}
            </p>
            <div className="bg-inherit col-span-3 grid grid-cols-5 gap-3">
              {singleCas.isSoc ? (
                <>
                  <p className="col-span-1 bg-inherit text-sm text-red flex gap-2">
                    <img
                      className={imgClass}
                      src={warn}
                    ></img>{" "}
                    SoC
                  </p>
                  <p className="col-span-4 bg-inherit text-sm text-gray truncate">
                    {singleCas.socSources.length > 0
                      ? "Source: " +
                        singleCas.socSources
                          .map((id) => providerNames[id])
                          .join(", ")
                      : "-"}
                  </p>
                </>
              ) : (
                <>
                  <p className="bg-inherit text-sm col-span-1 text-gray">-</p>
                  <p className="bg-inherit text-sm col-span-4 text-gray">-</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function FdsOutput({ pdfObjects, goBackHome }) {
  const [isSourceVisibleMap, setIsSourceVisibleMap] = useState(
    new Map(providerNames.map((provider, i) => [i, true])),
  );
  const [filteredPdfObjects, setFilteredPdfObjects] = useState(pdfObjects);
  // index of pdf objects that were clicked on by user,
  // useful to keep track of who is expanded after sorting
  const [expandedMap, setExpandedMap] = useState(
    new Map(pdfObjects.map((o, i) => [i, false])),
  );

  useEffect(() => {
    const visibleIds = Array.from(
      isSourceVisibleMap.entries().filter(([i, isVisible]) => isVisible),
    ).map(([i, isVisible]) => i);

    // Filter out cas deselected by user
    //
    // WARN: There might be a more optimal way to get filtered objects
    // than to clone them every re-render, maybe think about it later
    const tempObjects = window.structuredClone(pdfObjects);
    tempObjects.forEach((pdfObject, i) => {
      pdfObject.cas = pdfObject.cas.filter(
        (cas, i) =>
          !cas.isSoc ||
          cas.socSources.length == 0 ||
          cas.socSources.some((id) => visibleIds.includes(id)),
      );
      pdfObject.socNb = pdfObject.cas.reduce((acc, cas) => acc + cas.isSoc, 0);
      pdfObject.originalIndex = i;
    });
    tempObjects.sort((a, b) => b.socNb - a.socNb);
    setFilteredPdfObjects(tempObjects);

    return () => setFilteredPdfObjects(pdfObjects);
  }, [isSourceVisibleMap]);

  console.log(pdfObjects);
  console.log(filteredPdfObjects);

  const casCounts = filteredPdfObjects.map((pdfObject) => pdfObject.cas.length);
  const dangerCasCounts = filteredPdfObjects.map(
    (pdfObject) => pdfObject.cas.filter((cas) => cas.isSoc).length,
  );

  const casCount = casCounts.reduce((acc, cur) => acc + cur, 0);
  const dangerCasCount = dangerCasCounts.reduce((acc, cur) => acc + cur, 0);

  return (
    <div className="items-center px-2 sm:px-6 lg:px-8 flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        <p className="text-3xl w-0 font-bold pb-4 flex-[1_0_100%]">
          Vos résultats
        </p>
        <div className="flex flex-col gap-4 pb-4">
          <div
            className={`bg-white relative flex justify-around gap-2 w-4xl overflow-hidden rounded-md \
                           px-3 py-1`}
          >
            <div className="flex gap-1">
              <p className="font-bold">{filteredPdfObjects.length}</p>
              <p>FDS {pluralize("chargée", filteredPdfObjects.length)}</p>
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
          <div className="bg-white relative flex flex-col gap-2 w-4xl overflow-hidden rounded-md py-4 px-4 text-sm">
            {filteredPdfObjects.map((pdfObject, i) => (
              <PdfRow
                pdfObject={pdfObject}
                casCount={casCounts[i]}
                dangerCasCount={dangerCasCounts[i]}
                isExpanded={expandedMap.get(pdfObject.originalIndex)}
                toggleExpanded={() =>
                  toggleMapItem(
                    expandedMap,
                    setExpandedMap,
                    pdfObject.originalIndex,
                  )
                }
                key={i}
              />
            ))}
          </div>
          <button
            className={`self-center mt-8 border-[0.5px] border-gray rounded-md \
            px-[0.63rem] cursor-pointer text-sm transition-colors \
                hover:bg-faded-gray`}
            onClick={goBackHome}
          >
            Ajouter de nouvelles FDS
          </button>
        </div>
        <SidePanel
          toggleSourceVisible={(id) =>
            toggleMapItem(isSourceVisibleMap, setIsSourceVisibleMap, id)
          }
          isSourceVisibleMap={isSourceVisibleMap}
        />
      </div>
    </div>
  );
}

export default FdsOutput;
