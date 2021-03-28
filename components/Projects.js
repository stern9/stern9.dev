import CardItem from "./CardItem";

const Projects = () => {
  return (
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  lg:max-w-full">
        <CardItem
          image="/img/project_1.jpg"
          alt="Code Snippets CRUD preview"
          header="2021 - Code Snippets CRUD"
          previewURL="https://nextjs-code-snippets.vercel.app/"
          codeURL="https://github.com/stern9/nextjs-code-snippets"
          description="A CRUD interface to document and keep track of common snippets
              used. Built with NextJS and TailwindCSS. Data stored using
              FaunaDB."
        />
        <CardItem
          image="/img/project_2.jpg"
          alt="eCommerce App preview"
          header="2021 - ecommerce app"
          previewURL="https://stern-eshop.herokuapp.com/"
          codeURL="https://github.com/stern9/stern9-eshop"
          description="Full Stack ecommerce MERN App. Built with React, NodeJS and
              Express. Data is handled using MongoDB. Payments managed through
              PayPal."
        />
        <CardItem
          image="/img/project_3.jpg"
          alt="Anime App preview"
          header="2021 - anime app"
          previewURL="https://stern9-anime-app.netlify.app/"
          codeURL="https://github.com/stern9/anime-app"
          description="React application pulling data from MyAnimeList using the Jikan
              API. Search bar pulls specific data. Every new render triggers a fan 
              favorite animation."
        />
        <CardItem
          image="/img/project_4.jpg"
          alt="Amex landing page preview"
          header="2020 - Amex landing page"
          previewURL="https://amex-info.netlify.app/"
          codeURL="https://github.com/stern9/amex-work-example"
          description="American Express card holders informative landing page. Pulls end 
              user information and provides personalized content and experience."
        />
        <CardItem
          image="/img/project_5.jpg"
          alt="Playstation offers preview"
          header="2019 - Playstation offers"
          previewURL="https://playstation-thanksgiving.netlify.app/"
          codeURL="https://github.com/stern9/playstation-work-example"
          description="Landing page for Playstation - and their different games available 
              during thanksgiving. Includes an interactive quiz. Used as an email as well."
        />
        <CardItem
          image="/img/project_6.jpg"
          alt="Digitas holidays site preview"
          header="2018 - Digitas holidays site"
          previewURL="https://digitas-unicorn-landing.netlify.app/"
          codeURL="https://github.com/stern9/digitas-unicorn-landing"
          description="Digitas landing page during the holiday season. Location access 
              required to display a personalized unicorn. With the help of the OpenWeather API."
        />
      </div>
    </div>
  );
};

export default Projects;
