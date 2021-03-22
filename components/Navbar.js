import ToggleDarkMode from "./ToggleDarkMode";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="py-10">
      <nav className="bg-gray-100 dark:bg-black py-3 fixed top-0 inset-x-0 z-50">
        <div className="px-8 mx-auto">
          <div className="flex justify-between">
            <div className="flex space-x-4">
              <div>
                <Link href="/">
                  <a className="flex items-center hover:text-gray-400">
                    <svg
                      className="w-6 h-6 mr-2 text-black-400 dark:text-white "
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      ></path>
                    </svg>
                    <h1 className="text-3xl bold">
                      Avram Stern{" "}
                      <span className="block text-base">
                        Full Stack Developer
                      </span>
                    </h1>
                  </a>
                </Link>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-3">
              <Link href="/about">
                <a className="p-1 sm:p-4 text-gray-700 dark:text-gray-100 hover:text-gray-400 ">
                  About
                </a>
              </Link>
              <Link href="/portfolio">
                <a className="p-1 sm:p-4 text-gray-700 dark:text-gray-100 hover:text-gray-400">
                  Portfolio
                </a>
              </Link>
              <Link href="/contact">
                <a className="p-1 sm:p-4 text-gray-700 dark:text-gray-100 hover:text-gray-400">
                  Contact
                </a>
              </Link>
              <ToggleDarkMode />
            </div>

            {/* hamburger menu icon */}
            <div className="md:hidden flex items-center">
              <button
                className="mobile-menu-button"
                onClick={() => {
                  const btn = document.querySelector(
                    "button.mobile-menu-button"
                  );
                  const menu = document.querySelector(".mobile-menu");
                  menu.classList.toggle("hidden");
                }}
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* mobile menu */}
        <div className="mobile-menu hidden md:hidden text-center">
          <Link href="/about">
            <a className="block py-4 px-4 text-md text-gray-700 dark:text-gray-100 hover:text-gray-400 ">
              About
            </a>
          </Link>
          <Link href="/portfolio">
            <a className="block py-4 px-4 text-md text-gray-700 dark:text-gray-100 hover:text-gray-400">
              Portfolio
            </a>
          </Link>
          <Link href="/contact">
            <a className="block py-4 px-4 text-md text-gray-700 dark:text-gray-100 hover:text-gray-400">
              Contact
            </a>
          </Link>
          <ToggleDarkMode />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
