import logoUrl from "/src/assets/socFinderLogo.svg";
import home from "/src/assets/home.svg";

function Header({ goBackHome }) {
  return (
    <header>
      <div>
        <div className="relative flex h-16 justify-between">
          <button
            className="px-8 cursor-pointer"
            onClick={goBackHome}
          >
            <img
              className="w-[8rem]"
              src={logoUrl}
            ></img>
          </button>
          <button
            className="px-8 cursor-pointer"
            onClick={goBackHome}
          >
            <img
              className=""
              src={home}
            ></img>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
