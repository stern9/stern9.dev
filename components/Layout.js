import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Layout({ children }) {
  return (
    <div className="h-full">
      <Navbar />
      <main className="flex flex-col justify-center bg-white dark:bg-primary">
        {children}
        <Footer />
      </main>
    </div>
  );
}
