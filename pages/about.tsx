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
        description="Avram Stern is a senior full stack engineer in San José, Costa Rica, with 10+ years at Prodigious/Publicis and Gorilla Logic, now building with AI agents and verifying what they build."
      />
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          About
        </h1>
      </header>

      <div className="prose prose-zinc max-w-none dark:prose-invert sm:prose-lg">
        <p className="lead">
          I&apos;m Avram Stern, a senior full stack engineer in San José, Costa Rica
          🇨🇷, with more than 10 years of building for the web. I work across
          the stack, from HTML email that renders in Outlook to authentication
          flows that span several applications, and these days I build with AI
          agents and verify what they ship. The full history is on my{" "}
          <Link href={site.resume}>résumé</Link>.
        </p>

        <h2>Work</h2>
        <p>
          From 2013 to 2021 I was at Prodigious, part of Publicis, growing from
          media operations to senior creative engineer. I built emails and
          landing pages for American Express, Delta, Kellogg&apos;s,
          Dunkin&apos; and PlayStation, where fallbacks and testing on real
          clients were the job, not an afterthought. One example:{" "}
          <Link href="/blog/building-an-interactive-email-that-works-in-outlook">
            an interactive PlayStation email that still works in Outlook
          </Link>
          . I also made my{" "}
          <a
            href="http://stern9.github.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            first personal site
          </a>{" "}
          in 2013.
        </p>
        <p>
          Since 2021 I&apos;ve been at Gorilla Logic, embedded on client
          product teams. At HIMSS I built activity feeds and real-time chat for
          a healthcare networking platform. At The Pro&apos;s Closet I helped
          build an e-commerce storefront from scratch on Next.js. At Cyngn I
          built terrain layers for a mapping editor used to route autonomous
          industrial robots. At Panasonic Well I owned the Stripe auth and
          payment flows, led the change that made 3D Secure mandatory for Japan,
          and ran production releases for the web apps. A recent example of how
          I work is{" "}
          <Link href="/blog/explaining-auth-changes-with-an-ai-skill">
            an authentication change across several applications
          </Link>{" "}
          and how I explained it to the team.
        </p>

        <h2>How I work now</h2>
        <p>
          I build software with AI agents and still know exactly what got
          built. The brief and the conventions come before any code. Agents run
          in parallel on separate pieces. The compiler, the linter and the tests
          decide when something is done, and I review everything that comes
          back. At work this looks like Claude Code skills that read a Jira
          ticket, map the change across two repositories and propose an
          estimate with its reasoning, and agents that trace a bug from the
          front end to the production database. AI drafts and investigates. I
          validate every finding against the code and handle anything
          client-facing myself.
        </p>
        <p>
          Rust is where this clicked: a strict compiler is a reviewer that never
          gets tired, and I{" "}
          <Link href="/blog/building-dirsize-a-disk-usage-tool-in-rust">
            wrote about building a disk usage tool with it
          </Link>
          . The same thinking applies to AI in production.{" "}
          <a
            href="https://github.com/stern9/pii-gate"
            target="_blank"
            rel="noopener noreferrer"
          >
            pii-gate
          </a>{" "}
          is a TypeScript library that masks personal data in prompts before
          they reach an LLM API and restores it in the reply. TypeScript and
          JavaScript are still home.
        </p>

        <h2>About this site</h2>
        <p>
          Built with Next.js and Tailwind CSS. Posts are Markdown rendered at
          build time, and the Spotify API feeds the list below. It runs on an
          Ubuntu server I set up myself, with Nginx in front of Node.js.
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
