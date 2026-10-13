import Link from "next/link";
import Layout from "../components/Layout";
import Seo from "../components/Seo";
import TopTracks from "../components/TopTracks";
import { site } from "../lib/site";

const about = () => {
  return (
    <Layout>
      <Seo
        title="About"
        description="About Avram Stern, a full stack developer based in Costa Rica."
      />
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          About
        </h1>
      </header>

      <div className="prose prose-zinc max-w-none dark:prose-invert sm:prose-lg">
        <p className="lead">
          I&apos;m Avram Stern, a developer based in Costa Rica 🇨🇷.
        </p>
        <p>
          This is my own personal and tiny space on the web where I share
          projects, write about what I&apos;m learning, and keep track of the
          things I like to do. More about my experience can be found on my{" "}
          <a href={site.resume} target="_blank" rel="noopener noreferrer">
            resumé
          </a>
          .
        </p>
        <p>
          I made my first personal site back in 2013. It was a static build
          hosted on GitHub and, to be honest, not that great. But hey, we have
          to start somewhere, right? If you want to see some of my first
          projects,{" "}
          <a
            href="http://stern9.github.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            go ahead and check it out
          </a>
          .
        </p>

        <h2>Currently learning</h2>
        <p>
          How to build software with AI agents and still know exactly what got
          built. These days that means writing the brief and the conventions
          before any code, running agents in parallel, trying new skills and new
          kinds of models on real problems, and reviewing everything that comes
          back. The stack is getting huge, with all the awesome tools we have
          available now, so there is always something new to try.
        </p>
        <p>
          I also finally gave Rust a try, and{" "}
          <Link href="/blog/building-dirsize-a-disk-usage-tool-in-rust">
            wrote about it
          </Link>
          . It turns out a strict compiler is a great supervisor for an agent.
          TypeScript and JavaScript are still home. And I keep learning how the
          cloud works, with more focus on security now. The internet is becoming
          a dangerous place, and we should all use it responsibly.
        </p>

        <h2>About this site</h2>
        <p>
          Built with Next.js and Tailwind CSS. Blog posts are written in
          Markdown and rendered at build time, and a couple of APIs connect
          things like Spotify. It&apos;s hosted on a server I set up myself with
          Node.js and Nginx on an Ubuntu cloud machine.
        </p>
        <p>
          I write the posts, and I build and edit with AI tools. Anything on
          this site written by a model carries an &ldquo;AI-generated&rdquo;
          badge, so you always know who is talking.
        </p>

        <h2>On repeat</h2>
        <p>
          Just for fun, I linked the Spotify API to this site. These are my
          current top 10 tracks, mostly from my &lsquo;mambamentality&rsquo;
          workout playlist 💪🏻. Maybe you&apos;ll like a song or two.
        </p>
      </div>

      <div className="mt-6">
        <TopTracks />
      </div>
    </Layout>
  );
};

export default about;
