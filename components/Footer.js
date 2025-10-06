import NowPlaying from "./NowPlaying";
import Link from "next/link";
import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaFacebook,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="text-primary dark:text-white body-font">
      <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
        <NowPlaying />
        <p className="text-sm text-gray-900 dark:text-gray-100 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
          © 2025 —
          <Link
            href="https://stern9.dev"
            className="text-gray-900 dark:text-gray-100 ml-1"
            rel="noopener noreferrer"
            target="_blank"
          >
            stern9
          </Link>
        </p>
        <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
          <Link
            href="https://github.com/stern9"
            className="hover:text-primary-gray-20"
            target="_blank"
          >
            <FaGithub />
          </Link>
          <Link
            href="https://www.linkedin.com/in/stern9/"
            className="ml-4 hover:text-primary-gray-20"
            target="_blank"
          >
            <FaLinkedinIn />
          </Link>
          <Link
            href="https://www.facebook.com/avramstern"
            className="ml-4 hover:text-primary-gray-20"
            target="_blank"
          >
            <FaFacebook />
          </Link>
          <Link
            href="https://twitter.com/avramstern"
            className="ml-4 hover:text-primary-gray-20"
            target="_blank"
          >
            <FaTwitter />
          </Link>
          <Link
            href="https://www.instagram.com/stern9/"
            className="ml-4 hover:text-primary-gray-20"
            target="_blank"
          >
            <FaInstagram />
          </Link>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
