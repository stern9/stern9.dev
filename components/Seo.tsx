import Head from "next/head";
import { useRouter } from "next/router";
import { site } from "../lib/site";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const TWITTER_HANDLE = "@avramstern";

/** Absolute URL of the generated Open Graph card for a given title. */
export const ogImageUrl = (title?: string, label?: string) => {
  const params = new URLSearchParams();
  if (title) params.set("title", title);
  if (label) params.set("label", label);
  const query = params.toString();
  return `${site.url}/api/og${query ? `?${query}` : ""}`;
};

const Seo = ({
  title,
  description = site.description,
  type = "website",
  date,
  image,
  author = site.name,
  noindex,
}: {
  title?: string;
  description?: string;
  type?: "website" | "article";
  date?: string;
  /** Absolute image URL; defaults to the generated card for `title`. */
  image?: string;
  /** Article author name (used for BlogPosting JSON-LD). */
  author?: string;
  noindex?: boolean;
}) => {
  const { asPath, pathname } = useRouter();
  const url = `${site.url}${asPath === "/" ? "" : asPath.split(/[?#]/)[0]}`;
  const fullTitle = title ? `${title} | ${site.name}` : site.title;
  const ogImage = image ?? ogImageUrl(title);

  const person = {
    "@type": "Person",
    name: site.name,
    url: site.url,
  };

  let jsonLd: Record<string, unknown> | null = null;
  if (pathname === "/") {
    jsonLd = {
      "@context": "https://schema.org",
      ...person,
      jobTitle: "Senior Full Stack Engineer",
      image: `${site.url}/img/me.png`,
      sameAs: Object.values(site.social),
    };
  } else if (type === "article") {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: title ?? site.title,
      description,
      ...(date && { datePublished: date }),
      author: { ...person, name: author },
      url,
      mainEntityOfPage: url,
      image: ogImage,
    };
  }

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex ? (
        <meta name="robots" content="noindex" />
      ) : (
        <link rel="canonical" href={url} />
      )}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content={String(OG_WIDTH)} />
      <meta property="og:image:height" content={String(OG_HEIGHT)} />
      <meta property="og:image:alt" content={fullTitle} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {date && <meta property="article:published_time" content={date} />}
      {type === "article" && (
        <meta property="article:author" content={author} />
      )}
      {jsonLd && (
        <script
          type="application/ld+json"
          // Escape "<" so post titles can't close the script tag.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
    </Head>
  );
};

export default Seo;
