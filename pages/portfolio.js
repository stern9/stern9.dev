import Head from "next/head";
import Layout from "../components/Layout";
import Projects from "../components/Projects";

const portfolio = () => {
  return (
    <>
      <Head>
        <title>Avram Stern | Portfolio</title>
        <meta name="keywords" content="stern9" />
      </Head>
      <Layout>
        <div className="justify-center pt-14">
          <p className="text-3xl text-center">Some of my projects</p>
        </div>
        <Projects />
      </Layout>
    </>
  );
};

export default portfolio;
