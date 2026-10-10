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
          TypeScript, React Native, Docker and more about how the cloud works
          (AWS, I see you!). Eventually I want to give Rust a try, and of course
          keep going with JavaScript. You can never stop learning about this
          wonderful and complex language.
        </p>

        <h2>About this site</h2>
        <p>
          Built with Next.js and Tailwind CSS. Blog posts are written in
          Markdown and rendered at build time, and a couple of APIs connect
          things like Spotify. It&apos;s hosted on a server I set up myself with
          Node.js and Nginx on an Ubuntu cloud machine.
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
