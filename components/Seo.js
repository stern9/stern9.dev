import Head from "next/head";
import { useRouter } from "next/router";
import { site } from "../lib/site";

const Seo = ({
  title,
  description = site.description,
  type = "website",
  date,
}) => {
  const { asPath } = useRouter();
  const url = `${site.url}${asPath === "/" ? "" : asPath.split(/[?#]/)[0]}`;
  const fullTitle = title ? `${title} | ${site.name}` : site.title;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {date && <meta property="article:published_time" content={date} />}
    </Head>
  );
};

export default Seo;
