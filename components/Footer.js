import NowPlaying from "./NowPlaying";
import Link from "next/link";
import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaFacebook,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="text-gray-900 dark:text-gray-100 body-font">
      <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
        <NowPlaying />
        <p className="text-sm text-gray-900 dark:text-gray-100 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
          © 2021 —
          <Link href="https://stern9.dev">
            <a
              className="text-gray-900 dark:text-gray-100 ml-1"
              rel="noopener noreferrer"
              target="_blank"
            >
              stern9
            </a>
          </Link>
        </p>
        <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
          <Link href="https://github.com/stern9">
            <a className="hover:text-primary-gray-20" target="_blank">
              <FaGithub />
            </a>
          </Link>
          <Link href="https://www.linkedin.com/in/stern9/">
            <a className="ml-4 hover:text-primary-gray-20" target="_blank">
              <FaLinkedinIn />
            </a>
          </Link>
          <Link href="https://www.facebook.com/avramstern">
            <a className="ml-4 hover:text-primary-gray-20" target="_blank">
              <FaFacebook />
            </a>
          </Link>
          <Link href="https://twitter.com/avramstern">
            <a className="ml-4 hover:text-primary-gray-20" target="_blank">
              <FaTwitter />
            </a>
          </Link>
          <Link href="https://www.instagram.com/stern9/">
            <a className="ml-4 hover:text-primary-gray-20" target="_blank">
              <FaInstagram />
            </a>
          </Link>
        </span>
      </div>
    </footer>
  );
}

export default Footer;
