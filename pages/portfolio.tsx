import Link from "next/link";
import Layout from "../components/Layout";
import Seo from "../components/Seo";
import Projects from "../components/Projects";

const portfolio = () => {
  return (
    <Layout>
      <Seo
        title="Projects"
        description="Recent tools and libraries, client work and archived projects by Avram Stern."
      />
      <header className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Projects
        </h1>
        <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
          The tools and libraries I&apos;m building now, the product teams
          I&apos;ve worked on since 2021, then agency work and an archive.
        </p>
        <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
          The recent section is personal work with public source. The
          product-team work is private code, so those cards describe what I
          built without a source link, and the blog has{" "}
          <Link
            href="/blog/explaining-auth-changes-with-an-ai-skill"
            className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 hover:text-accent hover:decoration-current dark:text-zinc-100 dark:decoration-zinc-700 dark:hover:text-accent-light"
          >
            a case study from the job
          </Link>
          .
        </p>
      </header>
      <Projects />
    </Layout>
  );
};

export default portfolio;
