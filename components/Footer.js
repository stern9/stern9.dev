import Link from "next/link";
import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaFacebook,
  FaRss,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import NowPlaying from "./NowPlaying";
import { site } from "../lib/site";

const socials = [
  { href: site.social.github, label: "GitHub", Icon: FaGithub },
  { href: site.social.linkedin, label: "LinkedIn", Icon: FaLinkedinIn },
  { href: site.social.x, label: "X (Twitter)", Icon: FaXTwitter },
  { href: site.social.instagram, label: "Instagram", Icon: FaInstagram },
  { href: site.social.facebook, label: "Facebook", Icon: FaFacebook },
];

const Footer = () => {
  return (
    <footer className="mx-auto w-full max-w-3xl px-5 pb-10 pt-16 sm:px-6">
      <div className="border-t border-zinc-200 pt-8 dark:border-zinc-800">
        <NowPlaying />
        <div className="mt-6 flex flex-col-reverse gap-4 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between dark:text-zinc-400">
          <p>© {new Date().getFullYear()} Avram Stern</p>
          <div className="flex items-center gap-4">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
            <Link
              href="/rss.xml"
              aria-label="RSS feed"
              className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              <FaRss className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
