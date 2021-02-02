import NowPlaying from "./NowPlaying";
import Link from "next/link";
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
          <div className="flex-1 flex flex-col items-center justify-center md:items-end md:border-r border-gray-100 md:pr-5">
            <Link href="/about">
              <a
                aria-current="page"
                className="hover:text-gray-700 dark:hover:text-white"
              >
                About
              </a>
            </Link>
            <Link href="/portfolio">
              <a
                aria-current="page"
                className="hover:text-gray-700 dark:hover:text-white"
              >
                Portfolio
              </a>
            </Link>
            <Link href="/contact">
              <a
                aria-current="page"
                className="hover:text-gray-700 dark:hover:text-white"
              >
                Contact
              </a>
            </Link>
          </div>
          <div className="md:hidden mt-1 mx-auto w-11 h-px rounded-full"></div>
          <div className="grid md:border-r border-gray-100 px-4 ">
            <div className="mt-4 md:mt-0 flex-1 flex items-end justify-center">
              <a
                className="hover:text-primary-gray-20"
                href="https://github.com/"
                target="_blank"
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
            <div className="flex justify-center mt-2">
              <NowPlaying />
            </div>
          </div>

          <div className="md:hidden mt-1 mx-auto w-11 h-px rounded-full "></div>
          <div className="mt-3 md:mt-0 flex-1 flex flex-col items-center justify-center md:items-start md:pl-5">
            <span className="">© 2021 Copyright</span>
            <span className="mt-3 md:mt-1">
              <a className="hover:text-primary-gray-20" href="">
                Made by stern9
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
