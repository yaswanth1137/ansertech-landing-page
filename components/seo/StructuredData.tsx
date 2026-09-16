import { SITE_URL } from "@/lib/seo";

// Server components — rendering a plain <script type="application/ld+json">
// (rather than next/script) puts the JSON-LD directly in the server-rendered
// HTML instead of injecting it client-side after hydration.

function JsonLd({ id, schema }: { id: string; schema: object }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Organization Schema - Defines the business entity
 * Place in root layout for site-wide structured data
 */
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AnserTech",
    alternateName: "AnserTech AI",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/brand/logo.svg`,
      width: 512,
      height: 512,
    },
    sameAs: [
      "https://twitter.com/ansertech",
      "https://www.linkedin.com/company/ansertech",
      "https://www.facebook.com/ansertech",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      // ponytail: no real support phone number on file — omit rather than
      // ship a placeholder; add telephone here once one exists.
      contactType: "customer support",
      availableLanguage: ["English", "Hindi"],
      areaServed: "IN",
    },
    description: "AI Voice Agent Platform for Indian businesses. Automate calls, bookings, and customer support in 12 Indian languages.",
    foundingDate: "2024",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
  };

  return <JsonLd id="organization-schema" schema={schema} />;
}

/**
 * Software Application Schema - Defines the SaaS product
 * Place on homepage and product pages
 */
export function SoftwareAppSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AnserTech AI Voice Agent Platform",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Cloud, Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      description: "Free trial available. Paid plans start at ₹2,999/month.",
    },
    // ponytail: no real review/rating system on file — omit aggregateRating
    // rather than ship fabricated numbers (Google penalizes fake review data).
    featureList: [
      "AI-powered voice conversations in 12 Indian languages",
      "24/7 automated call answering",
      "Appointment booking automation",
      "Google Calendar integration",
      "Real-time call analytics",
      "Knowledge-grounded answers from your website and documents",
      "Multilingual support",
      "Call transcription and summaries",
    ],
    countriesSupported: "IN",
    inLanguage: ["en", "hi", "ta", "te", "kn", "ml", "mr", "bn", "gu", "pa", "od", "raj"],
    screenshot: {
      "@type": "ImageObject",
      url: `${SITE_URL}/og-image.jpg`,
    },
  };

  return <JsonLd id="software-schema" schema={schema} />;
}

/**
 * FAQ Page Schema - For FAQ sections
 * Usage: <FAQSchema faqs={[{ question: "...", answer: "..." }]} />
 */
interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSchema({ faqs }: { faqs: FAQItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return <JsonLd id="faq-schema" schema={schema} />;
}

/**
 * Breadcrumb Schema - For navigation breadcrumbs
 * Usage: <BreadcrumbSchema items={[{ name: "Home", url: SITE_URL }, { name: "Pricing", url: `${SITE_URL}/pricing` }]} />
 */
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd id="breadcrumb-schema" schema={schema} />;
}

/**
 * Website Schema with Search - Enables Google Sitelinks Search Box
 * Place in root layout
 */
export function WebsiteSearchSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: SITE_URL,
    name: "AnserTech",
    description: "AI Voice Agents for Indian Businesses",
  };

  return <JsonLd id="website-schema" schema={schema} />;
}

/**
 * Local Business Schema - For local SEO
 * Use if you have a physical location
 */
export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AnserTech",
    image: `${SITE_URL}/brand/logo.svg`,
    url: SITE_URL,
    // ponytail: no real support phone number on file — omit rather than ship a placeholder.
    priceRange: "$$",
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    availableLanguage: ["English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Marathi"],
  };

  return <JsonLd id="local-business-schema" schema={schema} />;
}

/**
 * Product Schema - For specific features/pricing tiers
 * Use on pricing or feature pages
 */
interface ProductSchemaProps {
  name: string;
  description: string;
  price: string;
  priceCurrency?: string;
  availability?: string;
}

export function ProductSchema({
  name,
  description,
  price,
  priceCurrency = "INR",
  availability = "https://schema.org/InStock",
}: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency,
      availability,
    },
  };

  return <JsonLd id={`product-schema-${name.toLowerCase().replace(/\s+/g, "-")}`} schema={schema} />;
}

/**
 * Article Schema - For blog posts
 * Usage: <ArticleSchema title="..." author="..." datePublished="..." />
 */
interface ArticleSchemaProps {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  imageUrl?: string;
}

export function ArticleSchema({
  title,
  description,
  author,
  datePublished,
  dateModified,
  imageUrl,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: imageUrl ?? `${SITE_URL}/og-image.jpg`,
    author: {
      "@type": "Organization",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "AnserTech",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/brand/logo.svg`,
      },
    },
    datePublished,
    dateModified: dateModified || datePublished,
  };

  return <JsonLd id="article-schema" schema={schema} />;
}

export default {
  OrganizationSchema,
  SoftwareAppSchema,
  FAQSchema,
  BreadcrumbSchema,
  WebsiteSearchSchema,
  LocalBusinessSchema,
  ProductSchema,
  ArticleSchema,
};
