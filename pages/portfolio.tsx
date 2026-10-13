import Layout from "../components/Layout";
import Seo from "../components/Seo";
import Projects from "../components/Projects";

const portfolio = () => {
  return (
    <Layout>
      <Seo
        title="Projects"
        description="A selection of personal and client projects by Avram Stern."
      />
      <header className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Projects
        </h1>
        <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
          A selection of personal and work projects I&apos;ve built over the
          years.
        </p>
        <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
          You&apos;ll notice a jump from 2021 to 2026. I was building the whole
          time, just not in public: with Gorilla Logic, on client teams at
          Panasonic Well, Cyngn, HIMSS and The Pro&apos;s Closet, and on
          automation projects for a few clients of my own. That work lives in
          private repositories and isn&apos;t mine to publish.
        </p>
      </header>
      <Projects />
    </Layout>
  );
};

export default portfolio;
