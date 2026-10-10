import Layout from "../components/Layout";
import Seo from "../components/Seo";
import Form from "../components/Form";

const contact = () => {
  return (
    <Layout>
      <Seo title="Contact" description="Get in touch with Avram Stern." />
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Let&apos;s talk
        </h1>
        <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
          The fastest way to reach me is through this form. I&apos;ll get back
          to you as soon as I can.
        </p>
      </header>
      <Form />
    </Layout>
  );
};

export default contact;
