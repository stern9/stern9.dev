import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { HiOutlineMenuAlt4, HiOutlineX } from "react-icons/hi";
import ToggleDarkMode from "./ToggleDarkMode";

const links = [
  { href: "/blog", label: "Blog" },
  { href: "/portfolio", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [isOpen, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const close = () => setOpen(false);
    router.events.on("routeChangeStart", close);
    return () => router.events.off("routeChangeStart", close);
  }, [router.events]);

  const isActive = (href) =>
    router.pathname === href || router.pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/80 backdrop-blur-md dark:border-zinc-800/70 dark:bg-zinc-950/80">
      <nav className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5 sm:px-6">
        <Link
          href="/"
          className="text-[15px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
        >
          Avram Stern
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={`rounded-md px-3 py-2 text-sm transition-colors ${
                isActive(href)
                  ? "font-medium text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              {label}
            </Link>
          ))}
          <ToggleDarkMode />
        </div>

        <div className="flex items-center md:hidden">
          <ToggleDarkMode />
          <button
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            onClick={() => setOpen((open) => !open)}
            className="rounded-md p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            {isOpen ? (
              <HiOutlineX className="h-5 w-5" />
            ) : (
              <HiOutlineMenuAlt4 className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div
          id="mobile-menu"
          className="border-t border-zinc-200 px-5 pb-4 pt-2 md:hidden dark:border-zinc-800"
        >
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={`block rounded-md py-3 text-base ${
                isActive(href)
                  ? "font-medium text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
