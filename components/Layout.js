import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Footer from "../components/Footer";

export default function Layout({ children }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // After mounting, we have access to the theme
  useEffect(() => setMounted(true), []);

  return (
    <div className="h-full">
      <nav className="sticky-nav flex justify-items-stretch items-center max-w-4xl w-full p-6 my-0 md:my-4 mx-auto bg-white dark:bg-black">
        <div className="flex justify-start logo 4xl">
          <Link href="/">
            <a>
              <h1 className="text-3xl">
                Avram Stern{" "}
                <span className="block text-base">Full Stack Developer</span>
              </h1>
            </a>
          </Link>
        </div>
        <div className="flex justify-start ml-auto">
          <Link href="/about">
            <a className="p-1 sm:p-4 text-gray-900 dark:text-gray-100">About</a>
          </Link>
          <Link href="/portfolio">
            <a className="p-1 sm:p-4 text-gray-900 dark:text-gray-100">
              Portfolio
            </a>
          </Link>
          <Link href="/contact">
            <a className="p-1 sm:p-4 text-gray-900 dark:text-gray-100">
              Contact
            </a>
          </Link>
        </div>
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
      </nav>
      <main className="flex flex-col justify-center bg-white dark:bg-black">
        {children}
        <Footer />
      </main>
    </div>
  );
}
