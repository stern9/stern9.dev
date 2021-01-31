import Layout from "../components/Layout";

const about = () => {
  return (
    <Layout>
      <div className="flex flex-col justify-center items-start max-w-2xl mx-12 mb-16">
        <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white">
          About
        </h1>
        <h2 className="prose text-gray-600 dark:text-gray-400 mb-16">
          This will be my about page
        </h2>
      </div>
    </Layout>
  );
};

export default about;
