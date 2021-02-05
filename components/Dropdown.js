import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";

function Dropdown({ isOpen, toggle }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={
        isOpen
          ? "grid grid-rows-3 text-center items-center bg-white dark:bg-gray-600 text-black dark:text-white"
          : "hidden"
      }
      onClick={toggle}
    >
      <Link href="/about">
        <a className="p-4 hover:underline">About</a>
      </Link>
      <Link href="/portfolio">
        <a className="p-4 hover:underline">Portfolio</a>
      </Link>
      <Link href="/contact">
        <a className="p-4 hover:underline">Contact</a>
      </Link>
    </div>
  );
}

export default Dropdown;
