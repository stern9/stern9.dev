import Head from "next/head";
import Layout from "../components/Layout";
import Sparkles from "../components/Sparkles";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Head>
        <title>Avram Stern | Home</title>
        <meta name="keywords" content="stern9" />
      </Head>
      <Layout>
        <div className="flex flex-col justify-center items-start max-w-2xl mx-auto">
          <div className="flex relative items-center">
            <div className="container flex flex-col justify-between items-center py-4">
              <div className="flex flex-col items-center py-4">
                <Image src="/img/me.jpg" alt="me" width={160} height={160} />
                <Sparkles>
                  <h2 className="text-4xl font-bold my-6 text-center dark:text-white">
                    Hi, my name is Avram 🤘
                  </h2>
                </Sparkles>
                <p className="max-w-3xl text-3xl mx-auto px-6 dark:text-white text-gray-800 text-center py-2">
                  I&#x27;m a passionate developer and this is my personal site -
                  mainly used as a digital playground where I like to test and
                  learn new technologies.
                </p>
                <p className="max-w-3xl text-3xl mx-auto px-6 dark:text-white text-gray-800 text-center py-2">
                  Learning by creating awesome stuff - and keep growing as a
                  professional is my end goal. Here you can find a small
                  collection of the things I've learned and created over the
                  years.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
