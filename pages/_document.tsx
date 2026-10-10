import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Avram Stern — Blog"
          href="/rss.xml"
        />
      </Head>
      <body className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
