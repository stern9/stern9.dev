import Link from "next";
import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaFacebook,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="px-3 py-6 bg-white dark:bg-gray-800 text-2 text-gray-500 dark:text-gray-200 ">
      <div className="flex flex-col">
        <div className="md:hidden s mx-auto w-11 h-px rounded-full"></div>
        <div className="mt-1 md:mt-0 flex flex-col md:flex-row">
          <nav className="flex-1 flex flex-col items-center justify-center md:items-end md:border-r border-gray-100 md:pr-5">
            <a
              aria-current="page"
              href="#"
              className="hover:text-gray-700 dark:hover:text-white"
            >
              About
            </a>
            <a
              aria-current="page"
              href="#"
              className="hover:text-gray-700 dark:hover:text-white"
            >
              Portfolio
            </a>
            <a
              aria-current="page"
              href="#"
              className="hover:text-gray-700 dark:hover:text-white"
            >
              Contact
            </a>
          </nav>
          <div className="md:hidden mt-1 mx-auto w-11 h-px rounded-full"></div>
          <div className="mt-4 md:mt-0 flex-1 flex items-center justify-center md:border-r border-gray-100">
            <a
              className="hover:text-primary-gray-20"
              href="https://github.com/Charlie85270/tail-kit"
            >
              <span className="sr-only">View on GitHub</span>
              <FaGithub />
            </a>
            <a className="ml-4 hover:text-primary-gray-20" href="#">
              <span className="sr-only">IG</span>
              <FaLinkedinIn />
            </a>
            <a className="ml-4 hover:text-primary-gray-20" href="#">
              <span className="sr-only">IG</span>
              <FaFacebook />
            </a>
            <a
              className="ml-4 hover:text-primary-gray-20"
              href="https://github.com/Charlie85270/tail-kit"
            >
              <span className="sr-only">View on LinkedinIn</span>
              <FaTwitter />
            </a>

            <a className="ml-4 hover:text-primary-gray-20" href="#">
              <span className="sr-only">IG</span>
              <FaInstagram />
            </a>
          </div>
          <div className="md:hidden mt-1 mx-auto w-11 h-px rounded-full "></div>
          <div className="mt-3 md:mt-0 flex-1 flex flex-col items-center justify-center md:items-start md:pl-5">
            <span className="">© 2021</span>
            <span className="mt-3 md:mt-1">
              <a className="underline hover:text-primary-gray-20" href="">
                stern9
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
