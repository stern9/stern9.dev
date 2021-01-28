import Layout from "../components/Layout";

const portfolio = () => {
  return (
    <Layout>
      <div className="flex flex-col justify-center items-start mb-16">
        <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white">
          Portfolio Page
        </h1>
        <h2 className="prose text-gray-600 dark:text-gray-400 mb-16">
          This will be my portfolio page
        </h2>
        <h3 className="font-bold text-2xl md:text-4xl tracking-tight mb-4 text-black dark:text-white">
          Title
        </h3>
      </div>
    </Layout>
  );
};

export default portfolio;
