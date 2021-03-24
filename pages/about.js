import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";
import TopTracks from "../components/TopTracks";

const about = () => {
  return (
    <>
      <Head>
        <title>Avram Stern | About</title>
        <meta name="keywords" content="stern9" />
      </Head>
      <Layout>
        <div className="flex flex-col justify-center items-start max-w-2xl mx-auto ">
          <div className="flex relative items-center">
            <div className="container flex flex-col justify-between items-center py-4">
              <div className="flex flex-col items-center py-4">
                <p className="text-3xl my-6 text-center dark:text-white">
                  About me.
                </p>
                <div className="items-center justify-center mt-4 px-8 mx-auto">
                  <p className="text-4xl">
                    I'm Avram Stern a developer based in Costa Rica 🇨🇷
                  </p>
                  <p className="text-2xl py-4">
                    This is my own personal and tiny space on the web where I
                    can share projects and the things I like to do. More
                    information about me can be found on my{" "}
                    <Link href="https://www.cv.stern9.dev/">
                      <a
                        target="_blank"
                        className="underline font-bold text-secondary hover:bg-secondary hover:text-white"
                      >
                        resumé.
                      </a>
                    </Link>
                  </p>
                  <p className="text-2xl py-4">
                    I made my first personal site back on 2013, it was a static
                    build hosted on Github and to be honest not that great. But
                    hey we have to start somewhere right? - if you want to see
                    some of my first projects go ahead and{" "}
                    <Link href="http://stern9.github.io/">
                      <a
                        target="_blank"
                        className="underline font-bold text-secondary hover:bg-secondary hover:text-white"
                      >
                        check it out.
                      </a>
                    </Link>
                  </p>
                  <p className="text-1xl py-4">
                    <span className="text-1xl font-bold text-secondary">
                      About this site:
                    </span>{" "}
                    built with some of the technologies I've been working on
                    recently - NextJS styled using TailwindCSS with a couple of
                    API's used to connect social media information. All images
                    are of my personal/work projects - svg icons are a
                    combination of react-icons and heroicons. Hosted on a web
                    server also built by me using Express, NodeJS and Nginx on a
                    cloud machine running on Ubuntu.
                  </p>
                  <p className="text-1xl py-4">
                    <span className="text-1xl font-bold text-secondary">
                      I am currently learning about:
                    </span>{" "}
                    TypeScript, React Native, Docker and more about how the
                    cloud works (AWS - I see you!!) Eventually want to give Rust
                    a try and of course continue with JavaScript - you can never
                    stop learning about this wonderful and complex programming
                    language.
                  </p>
                  <p className="text-1xl py-4">
                    <span className="text-1xl font-bold text-secondary">
                      Just for fun:
                    </span>{" "}
                    I linked the Spotify API to this site, below you can see my
                    10 current favorite songs, these are mostly part of my
                    'mambamentality' working-out playlist 💪🏻😎 check them out,
                    maybe you like a song or two.
                  </p>
                  <TopTracks className="text-primary dark:text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default about;
