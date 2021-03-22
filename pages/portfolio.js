import Head from "next/head";
import Cards from "../components/Cards";
import Layout from "../components/Layout";
import Blog from "../components/Blog";

const portfolio = () => {
  return (
    <>
      <Head>
        <title>Avram Stern | Portfolio</title>
        <meta name="keywords" content="stern9" />
      </Head>
      <Layout>
        <Cards />
        <div className="flex flex-col justify-center items-start max-w-2xl mx-auto ">
          <div className="flex relative items-center">
            <div className="container flex flex-col justify-between items-center py-4">
              <div className="flex flex-col items-center py-4">
                <p className="text-3xl my-6 text-center dark:text-white">
                  This is the Portfolio page
                </p>
                <h2 className="max-w-3xl text-5xl md:text-6xl font-bold dark:text-white text-gray-800 text-center py-2">
                  I will add some of my projects here
                </h2>
              </div>
            </div>
          </div>
        </div>
        <Blog />
      </Layout>
    </>
  );
};

export default portfolio;
