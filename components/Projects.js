import Link from "next/link";
import Image from "next/image";

const Projects = () => {
  return (
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  lg:max-w-full">
        <div className="overflow-hidden transition-shadow duration-300 bg-white rounded shadow-lg">
          <Link href="https://nextjs-code-snippets.vercel.app/">
            <a target="_blank" rel="noreferrer">
              <Image
                src="/project_1.webp"
                alt="project1"
                width="600"
                height="500"
              />
            </a>
          </Link>
          <div className="p-5 border-t-0">
            <p className="mb-3 text-xs font-semibold tracking-wide uppercase">
              <span className="text-secondary">2021</span>
            </p>
            <p className="mb-4 text-primary">
              A CRUD interface to document and keep track of common snippets
              used alongside a team with their corresponding description. Built
              with NextJS and styled using TailwindCSS. Data stored using
              FaunaDB
            </p>
            <div className="py-4">
              <div className="flex justify-around">
                <button className="bg-primary dark:bg-secondary hover:bg-secondary dark:hover:bg-primary text-white border font-bold py-2 px-4 rounded ml-4 shadow">
                  <Link href="https://nextjs-code-snippets.vercel.app/">
                    <a target="_blank" rel="noreferrer" className="">
                      Preview
                    </a>
                  </Link>
                </button>
                <button className="bg-primary dark:bg-secondary hover:bg-secondary dark:hover:bg-primary text-white border font-bold py-2 px-4 rounded ml-4 shadow">
                  <Link href="https://github.com/stern9/nextjs-code-snippets">
                    <a target="_blank" rel="noreferrer" className="">
                      Code
                    </a>
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-hidden transition-shadow duration-300 bg-white rounded shadow-lg">
          <Link href="https://stern-eshop.herokuapp.com/">
            <a target="_blank" rel="noreferrer">
              <Image
                src="/project_2.webp"
                alt="project2"
                width="600"
                height="500"
              />
            </a>
          </Link>
          <div className="p-5 border-t-0">
            <p className="mb-3 text-xs font-semibold tracking-wide uppercase">
              <span className="text-secondary">2021</span>
            </p>
            <p className="mb-4 text-primary">
              Full Stack ecommerce MERN App. Front end built using React. Back
              end NodeJS and Express. Database is MongoDB. Separate interface
              for admin users and consumers. Payments through PayPal.
            </p>
            <div className="py-4">
              <div className="flex justify-around">
                <button className="bg-primary dark:bg-secondary hover:bg-secondary dark:hover:bg-primary text-white border font-bold py-2 px-4 rounded ml-4 shadow">
                  <Link href="https://stern-eshop.herokuapp.com/">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-700"
                    >
                      Preview
                    </a>
                  </Link>
                </button>
                <button className="bg-primary dark:bg-secondary hover:bg-secondary dark:hover:bg-primary text-white border font-bold py-2 px-4 rounded ml-4 shadow">
                  <Link href="https://github.com/stern9/stern9-eshop">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-700"
                    >
                      Code
                    </a>
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-hidden transition-shadow duration-300 bg-white rounded shadow-lg">
          <Link href="https://stern9-anime-app.netlify.app/">
            <a target="_blank" rel="noreferrer">
              <Image
                src="/project_3.webp"
                alt="project3"
                width="600"
                height="500"
              />
            </a>
          </Link>
          <div className="p-5 border-t-0">
            <p className="mb-3 text-xs font-semibold tracking-wide uppercase">
              <span className="text-secondary">2021</span>
            </p>
            <p className="mb-4 text-primary">
              React Anime application pulling data from 'MyAnimeList' using the{" "}
              <Link href="https://jikan.docs.apiary.io/">
                <a target="_blank" className="underline">
                  Jikan
                </a>
              </Link>{" "}
              API. Search bar is in charge pulling specific data to the front
              end. Every new render triggers a fan favorite animation.
            </p>
            <div className="py-4">
              <div className="flex justify-around">
                <button className="bg-primary dark:bg-secondary hover:bg-secondary dark:hover:bg-primary text-white border font-bold py-2 px-4 rounded ml-4 shadow">
                  <Link href="https://stern9-anime-app.netlify.app/">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-700"
                    >
                      Preview
                    </a>
                  </Link>
                </button>
                <button className="bg-primary dark:bg-secondary hover:bg-secondary dark:hover:bg-primary text-white border font-bold py-2 px-4 rounded ml-4 shadow">
                  <Link href="https://github.com/stern9/anime-app">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-700"
                    >
                      Code
                    </a>
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-hidden transition-shadow duration-300 bg-white rounded shadow-lg">
          <Link href="https://amex-info.netlify.app/">
            <a target="_blank" rel="noreferrer" className="text-gray-700">
              <Image
                src="/project_4.webp"
                alt="project4"
                width="600"
                height="500"
              />
            </a>
          </Link>
          <div className="p-5 border-t-0">
            <p className="mb-3 text-xs font-semibold tracking-wide uppercase">
              <span className="text-secondary">2020</span>
            </p>
            <p className="mb-4 text-primary">
              American Express card holders informative landing page. Aiming to
              explain the different benefits each cardholder has as part of an
              specific line of business. Pulls end user information and provides
              a personalized experience.
            </p>
            <div className="py-4">
              <div className="flex justify-around">
                <button className="bg-primary dark:bg-secondary hover:bg-secondary dark:hover:bg-primary text-white border font-bold py-2 px-4 rounded ml-4 shadow">
                  <Link href="https://amex-info.netlify.app/">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-700"
                    >
                      Preview
                    </a>
                  </Link>
                </button>
                <button className="bg-primary dark:bg-secondary hover:bg-secondary dark:hover:bg-primary text-white border font-bold py-2 px-4 rounded ml-4 shadow">
                  <Link href="https://github.com/stern9/amex-work-example">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-700"
                    >
                      Code
                    </a>
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-hidden transition-shadow duration-300 bg-white rounded shadow-lg">
          <Link href="https://playstation-thanksgiving.netlify.app/">
            <a target="_blank" rel="noreferrer" className="text-gray-700">
              <Image
                src="/project_5.webp"
                alt="project5"
                width="600"
                height="500"
              />
            </a>
          </Link>
          <div className="p-5 border-t-0">
            <p className="mb-3 text-xs font-semibold tracking-wide uppercase">
              <span className="text-secondary">2019</span>
            </p>
            <p className="mb-4 text-primary">
              Landing page built for Playstation brand - showcasing the
              different games available during thanksgiving. Includes an
              interactive quiz to find out what type of gamer type matches the
              end user depending on combination of results. Used as an email as
              well.
            </p>
            <div className="py-4">
              <div className="flex justify-around">
                <button className="bg-primary dark:bg-secondary hover:bg-secondary dark:hover:bg-primary text-white border font-bold py-2 px-4 rounded ml-4 shadow">
                  <Link href="https://playstation-thanksgiving.netlify.app/">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-700"
                    >
                      Preview
                    </a>
                  </Link>
                </button>
                <button className="bg-primary dark:bg-secondary hover:bg-secondary dark:hover:bg-primary text-white border font-bold py-2 px-4 rounded ml-4 shadow">
                  <Link href="https://github.com/stern9/playstation-work-example">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-700"
                    >
                      Code
                    </a>
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-hidden transition-shadow duration-300 bg-white rounded shadow-lg">
          <Link href="https://digitas-unicorn-landing.netlify.app/">
            <a target="_blank" rel="noreferrer">
              <Image
                src="/project_6.webp"
                alt="project6"
                width="600"
                height="500"
              />
            </a>
          </Link>
          <div className="p-5 border-t-0">
            <p className="mb-3 text-xs font-semibold tracking-wide uppercase">
              <span className="text-secondary">2018</span>
            </p>
            <p className="mb-4 text-primary">
              Landing page built for the holiday season. Location access needed
              to pull end user location and display an interactive unicorn based
              on the current temperature. With the help of the OpenWeather API.
              Several creative unicorns available for a range of temperatures.
            </p>
            <div className="py-4">
              <div className="flex justify-around">
                <button className="bg-primary dark:bg-secondary hover:bg-secondary dark:hover:bg-primary text-white border font-bold py-2 px-4 rounded ml-4 shadow">
                  <Link href="https://digitas-unicorn-landing.netlify.app/">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-700"
                    >
                      Preview
                    </a>
                  </Link>
                </button>
                <button className="bg-primary dark:bg-secondary hover:bg-secondary dark:hover:bg-primary text-white border font-bold py-2 px-4 rounded ml-4 shadow">
                  <Link href="https://github.com/stern9/digitas-unicorn-landing">
                    <a
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-700"
                    >
                      Code
                    </a>
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
