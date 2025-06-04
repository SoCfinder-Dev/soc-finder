import { useState } from "react";
import cross from "/src/assets/cross.svg";
import plus from "/src/assets/plus.svg";
import pipes from "/src/assets/pipes.svg";
import { providerNames } from "../socSources.tsx";

// Cannot transition from display none to flex with opacity
// on firefox (see: https://github.com/mdn/browser-compat-data/issues/26155)
// so we use a react state variable with a delay(in ms) to set the display first
// and then the opacity
//
// This might be overkill, since we could send it to the shadow realm with
// display: absolute, width: 1px, top: -1px
// but we prefer display hidden for accessibility reasons
//
var inProgress = false;
async function delayTyFirefox(
  filterExpanded,
  setFilterExpanded,
  setTyFirefox,
  delay,
) {
  if (!inProgress) {
    inProgress = true;
    setFilterExpanded(!filterExpanded);
    if (filterExpanded) {
      setTyFirefox("opacity-0");
      new Promise((res) => setTimeout(res, delay)).then(() => {
        setTyFirefox("hidden");
        inProgress = false;
      });
    } else {
      setTyFirefox("opacity-0");
      new Promise((res) => setTimeout(res, 1)).then(() => {
        setTyFirefox("opacity-100");
        inProgress = false;
      });
    }
  }
}

function SourceFilterButton({ name, isSourceVisible, setVisible }) {
  const [imgClassName, setImgClassName] = useState("transition-all");

  if (isSourceVisible) {
    return (
      <button
        className="flex gap-1 py-1 px-2 rounded-md cursor-pointer"
        onClick={setVisible}
      >
        <img src={cross}></img>
        <p className="text-xs">{name}</p>
      </button>
    );
  } else {
    return (
      <button
        className={`flex bg-white gap-1 py-1 px-2 rounded-md text-gray hover:text-black \
                    transition-all cursor-pointer`}
        onClick={setVisible}
        onMouseEnter={() => setImgClassName("transition-all")}
        onMouseLeave={() =>
          setImgClassName(
            "brightness-0\
                            saturate-100 invert-92 sepia-9 saturate-60 hue-rotate-329 \
                            brightness-81 contrast-89 transition-all",
          )
        }
      >
        <img
          src={plus}
          className={imgClassName}
        ></img>
        <p className="text-xs">{name}</p>
      </button>
    );
  }
}

function SidePanel({ isSourceVisibleMap, toggleSourceVisible }) {
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [tyFirefox, setTyFirefox] = useState("opacity-0");

  return (
    <div className="flex flex-col gap-2">
      <button
        className={`flex gap-1 items-center py-1 px-2 rounded-md hover:bg-white cursor-pointer
        transition-colors`}
        onClick={() =>
          delayTyFirefox(filterExpanded, setFilterExpanded, setTyFirefox, 500)
        }
      >
        <img src={pipes}></img>
        <p className="text-sm">Filtrer les sources</p>
      </button>
      <div
        className={`flex flex-col items-start gap-1 transition transition-opacity duration-500 transition-discrete \
           ${tyFirefox}`}
      >
        {providerNames.map((provider, i) => (
          <SourceFilterButton
            name={provider}
            isSourceVisible={isSourceVisibleMap.get(i)}
            setVisible={() => toggleSourceVisible(i)}
            key={i}
          />
        ))}
      </div>
    </div>
  );
}

export default SidePanel;
