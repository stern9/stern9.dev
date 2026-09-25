import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Layout = ({ children, cover }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-zinc-900 focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <Navbar />
      {cover}
      <main
        id="content"
        className={`mx-auto w-full max-w-3xl flex-1 px-5 sm:px-6 ${
          cover ? "pt-10 sm:pt-14" : "pt-14 sm:pt-20"
        }`}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
