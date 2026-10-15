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
          Tools and libraries I built in 2026, client work from my agency
          years, and an archive of earlier projects.
        </p>
        <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
          From 2021 to 2026 I worked on client product teams at Gorilla Logic
          (Panasonic Well, Cyngn, HIMSS, The Pro&apos;s Closet) and on
          automation projects for my own clients. That code is private, so the
          recent section below is personal work from 2026, and the blog has{" "}
          <Link
            href="/blog/explaining-auth-changes-with-an-ai-skill"
            className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 hover:text-accent hover:decoration-current dark:text-zinc-100 dark:decoration-zinc-700 dark:hover:text-accent-light"
          >
            case studies from the job
          </Link>
          .
        </p>
      </header>
      <Projects />
    </Layout>
  );
};

export default portfolio;
