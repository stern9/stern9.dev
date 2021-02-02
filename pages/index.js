import Head from "next/head";
import Layout from "../components/Layout";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Head>
        <title>Avram Stern | Home</title>
        <meta name="keywords" content="stern9" />
      </Head>
      <Layout>
        <div className="flex flex-col justify-center items-start max-w-2xl mx-auto ">
          <div className="flex relative items-center">
            <div className="container flex flex-col justify-between items-center py-4">
              <div className="flex flex-col items-center py-4">
                <Image src="/img/me.png" alt="me" width={160} height={160} />
                <p className="text-3xl my-6 text-center dark:text-white">
                  Hi, I&#x27;m Avram 🤘
                </p>
                <h2 className="max-w-3xl text-5xl md:text-6xl font-bold dark:text-white text-gray-800 text-center py-2">
                  Creating awesome stuff to get a super dope new job and grow as
                  a professional.
                </h2>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
