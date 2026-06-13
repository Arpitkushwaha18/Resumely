import { useEffect } from "react";

export const SITE_URL = "https://resumely-eight.vercel.app";

export const DEFAULT_SEO = {
  title: "Free Resume Builder & CV Maker Online | Resumely",
  description:
    "Create professional resumes and CVs for free with Resumely. AI-powered resume builder, CV maker, ATS-friendly resume templates, instant PDF download, and job-ready resume creation in minutes.",
  keywords:
    "resume builder, cv maker, free resume builder, online resume maker, professional resume, ats resume, resume templates, resume creator, cv builder, job resume, resume generator, resume design, resume format, curriculum vitae, free cv maker",
  socialDescription: "Create professional ATS-friendly resumes for free with Resumely.",
  type: "website",
  path: "/",
  appName: "Resumely",
  appDescription: "AI-powered resume and CV builder.",
};

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function upsertLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
}

function upsertJsonLd(id, data) {
  let element = document.getElementById(id);

  if (!element) {
    element = document.createElement("script");
    element.id = id;
    element.type = "application/ld+json";
    document.head.appendChild(element);
  }

  element.textContent = JSON.stringify(data);
}

export default function SEO({
  title = DEFAULT_SEO.title,
  description = DEFAULT_SEO.description,
  keywords = DEFAULT_SEO.keywords,
  socialDescription = DEFAULT_SEO.socialDescription,
  path = DEFAULT_SEO.path,
  type = DEFAULT_SEO.type,
  jsonLd,
}) {
  useEffect(() => {
    const canonicalUrl = path === "/" ? SITE_URL : new URL(path, SITE_URL).toString();
    const structuredData =
      jsonLd || {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: DEFAULT_SEO.appName,
        description: DEFAULT_SEO.appDescription,
        url: SITE_URL,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      };

    document.title = title;

    upsertMeta('meta[name="description"]', { name: "description", content: description });
    upsertMeta('meta[name="keywords"]', { name: "keywords", content: keywords });
    upsertMeta('meta[name="robots"]', { name: "robots", content: "index,follow" });
    upsertMeta('meta[name="author"]', { name: "author", content: "Resumely" });

    upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: socialDescription });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: type });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: "Resumely" });

    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: socialDescription });

    upsertLink("canonical", canonicalUrl);
    upsertJsonLd("resumely-web-application-schema", structuredData);
  }, [description, jsonLd, keywords, path, socialDescription, title, type]);

  return null;
}
