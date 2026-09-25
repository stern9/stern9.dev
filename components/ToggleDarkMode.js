import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";

const ToggleDarkMode = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      type="button"
      className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted &&
        (isDark ? (
          <HiOutlineSun className="h-[18px] w-[18px]" />
        ) : (
          <HiOutlineMoon className="h-[18px] w-[18px]" />
        ))}
    </button>
  );
};

export default ToggleDarkMode;
