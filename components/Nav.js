import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // After mounting, we have access to the theme
  useEffect(() => setMounted(true), []);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow sticky-nav">
      <div className="container mx-auto px-6 py-3 md:flex md:justify-between md:items-center">
        <div className="flex justify-between items-center">
          <div className="flex justify-start logo 4xl">
            <a>
              <h1 className="text-3xl">
                Avram Stern{" "}
                <span className="block text-base">Full Stack Developer</span>
              </h1>
            </a>
          </div>

          <div className="flex md:hidden">
            <button className="hamburger hamburger--emphatic" type="button">
              <span className="hamburger-box">
                <span className="hamburger-inner"></span>
              </span>
            </button>
          </div>
        </div>

        <div className="md:flex items-center">
          <div className="flex flex-col items-end md:flex-row md:mx-6">
            <a
              className="my-1 text-sm text-gray-700 dark:text-gray-200 font-medium hover:text-indigo-500 dark:hover:text-indigo-400 md:mx-4 md:my-0"
              href="#"
            >
              About
            </a>
            <a
              className="my-1 text-sm text-gray-700 dark:text-gray-200 font-medium hover:text-indigo-500 dark:hover:text-indigo-400 md:mx-4 md:my-0"
              href="#"
            >
              Portfolio
            </a>
            <a
              className="my-1 text-sm text-gray-700 dark:text-gray-200 font-medium hover:text-indigo-500 dark:hover:text-indigo-400 md:mx-4 md:my-0"
              href="#"
            >
              Contact
            </a>
          </div>

          <div className="flex justify-center md:block">
            <button
              aria-label="Toggle Dark Mode"
              type="button"
              className="bg-gray-200 dark:bg-gray-800 rounded p-3 h-10 w-10"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {mounted && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  className="h-4 w-4 text-gray-800 dark:text-gray-200"
                >
                  {theme === "dark" ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                    />
                  )}
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
