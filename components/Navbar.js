import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

function Navbar({ toggle }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <nav
      className="flex justify-between items-center sticky-nav h-16 bg-white dark:bg-gray-800 text-black dark:text-white relative shadow-sm font-mono"
      role="navigation"
    >
      <Link href="/">
        <a className="pl-8">
          <h1 className="text-3xl">
            Avram Stern{" "}
            <span className="block text-base">Full Stack Developer</span>
          </h1>
        </a>
      </Link>
      <div className="px-4 cursor-pointer md:hidden" onClick={toggle}>
        <svg
          className="w-8 h-8"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="pr-8 md:block hidden">
        <Link href="/about">
          <a className="p-4">About</a>
        </Link>
        <Link href="/portfolio">
          <a className="p-4">Portfolio</a>
        </Link>
        <Link href="/contact">
          <a className="p-4">Contact</a>
        </Link>
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
    </nav>
  );
}

export default Navbar;
