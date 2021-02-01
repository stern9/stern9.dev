import Head from "next/head";
import Layout from "../components/Layout";

const portfolio = () => {
  return (
    <>
      <Head>
        <title>Avram Stern | Portfolio</title>
        <meta name="keywords" content="stern9" />
      </Head>
      <Layout>
        <div className="flex flex-col justify-center items-start max-w-2xl mx-auto ">
          <div className="flex relative items-center">
            <div className="container flex flex-col justify-between items-center py-4">
              <div className="flex flex-col items-center py-4">
                <p className="text-3xl my-6 text-center dark:text-white">
                  This is the Portfolio
                </p>
                <h2 className="max-w-3xl text-5xl md:text-6xl font-bold dark:text-white text-gray-800 text-center py-2">
                  Some of my previous work will be displayed here
                </h2>
                <div className="flex items-center justify-center mt-4"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default portfolio;
