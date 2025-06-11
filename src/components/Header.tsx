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
          <div className="flex items-center">
            <a
              target="_blank"
              href="https://www.linkedin.com/company/soc-finder/"
              className={`flex flex-nowrap gap-2 py-1 px-2.5 border-[0.5px] \
            border-gray rounded-md items-center cursor-pointer hover:bg-faded-gray \
                transition-colors`}
            >
              <p className="text-sm/4 text-nowrap min-w-0 pt-[2px] flex-1">
                Contactez-nous
              </p>
            </a>
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
      </div>
    </header>
  );
}

export default Header;
