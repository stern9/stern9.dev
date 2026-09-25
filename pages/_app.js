import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import Head from "next/head";
import Script from "next/script";
import dynamic from "next/dynamic";
import { Inter, JetBrains_Mono } from "next/font/google";
import { GA_TRACKING_ID } from "../utils/gtag";

// Loaded client-side only; mounted here so the chat survives page navigation.
const Doofus = dynamic(() => import("../components/Doofus"), { ssr: false });

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const MyApp = ({ Component, pageProps }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      {GA_TRACKING_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}');
            `}
          </Script>
        </>
      )}
      <div className={`${sans.variable} ${mono.variable} font-sans`}>
        <Component {...pageProps} />
        <Doofus />
      </div>
    </ThemeProvider>
  );
};

export default MyApp;
