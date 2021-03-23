import { useState } from "react";
import Head from "next/head";
import Layout from "../components/Layout";
import Form from "../components/Form";

const contact = () => {
  return (
    <>
      <Head>
        <title>Avram Stern | Contact</title>
        <meta name="keywords" content="stern9" />
      </Head>
      <Layout>
        <div className="flex flex-col justify-center items-start max-w-2xl mx-auto ">
          <div className="flex relative items-center">
            <div className="container flex flex-col justify-between items-center pt-4">
              <div className="flex flex-col items-center pt-4">
                <p className="text-1xl my-6 text-center dark:text-white">
                  <span className="text-3xl block pb-2">Get in Touch.</span> The
                  fastest way to get a response from me is to send me an email
                  using the following form. I will try my best to respond to
                  your email as fast as I can.
                </p>
              </div>
            </div>
          </div>
        </div>
        <Form />
      </Layout>
    </>
  );
};

export default contact;
