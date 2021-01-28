import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import { ThemeProvider } from "next-themes";
import Head from "next/head";

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
