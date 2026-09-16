import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import Providers from "../lib/providers";
import { SmoothScroll } from "@/components/landing/SmoothScroll";
import { OrganizationSchema, WebsiteSearchSchema } from "@/components/seo/StructuredData";
const inter = { variable: "font-sans" };

const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION;
const bingSiteVerification = process.env.BING_SITE_VERIFICATION;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5CA3C" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0B0B" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ansertech.com"),

  title: {
    default: "AnserTech - AI Voice Agents for Indian Businesses",
    template: "%s | AnserTech - AI Voice Agents"
  },

  description: "Deploy AI voice agents that speak 12 Indian languages. Automate customer calls, bookings, and support 24/7. Built for restaurants, clinics, salons & more.",

  keywords: [
    "AI voice agent India",
    "voice automation",
    "AI receptionist",
    "restaurant booking AI",
    "clinic appointment automation",
    "voice AI for business",
    "IVR replacement",
    "automated phone calls",
    "Hindi voice AI",
    "multilingual voice bot",
    "customer support automation",
    "AI phone answering",
    "virtual receptionist India",
    "AI call center",
    "voice AI platform",
    "conversational AI India",
    "automated booking system",
    "AI phone assistant"
  ],

  authors: [{ name: "AnserTech Team", url: "https://ansertech.com" }],
  creator: "AnserTech",
  publisher: "AnserTech",

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://ansertech.com",
    siteName: "AnserTech",
    title: "AnserTech - AI Voice Agents for Indian Businesses",
    description: "Deploy AI voice agents that speak 12 Indian languages. Automate customer calls, bookings, and support 24/7.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AnserTech AI Voice Agents Platform - AI Voice Agents for Indian Businesses",
      }
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "AnserTech - AI Voice Agents for Indian Businesses",
    description: "Deploy AI voice agents that speak 12 Indian languages. Automate customer calls 24/7.",
    images: ["/og-image.jpg"],
    creator: "@ansertech",
    site: "@ansertech",
  },

  verification: {
    google: googleSiteVerification,
    other: {
      ...(bingSiteVerification ? { "msvalidate.01": bingSiteVerification } : {}),
    },
  },

  category: "Technology",
  classification: "Business Software",

  other: {
    "twitter:label1": "Languages Supported",
    "twitter:data1": "12 Indian Languages",
    "twitter:label2": "Setup Time",
    "twitter:data2": "Under 5 Minutes",
  },

  manifest: "/manifest.json",

  icons: {
    icon: [
      { url: "/brand/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/brand/icon.svg", type: "image/svg+xml" },
    ],
  },

  appleWebApp: {
    capable: true,
    title: "AnserTech",
    statusBarStyle: "black-translucent",
  },

  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Caveat:wght@400;500;600;700&family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Manrope:wght@400;500;600;700;800&family=Oswald:wght@500;600;700&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-SGS3HB3KBC"
          strategy="beforeInteractive"
        />
        <Script id="google-analytics" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SGS3HB3KBC');
          `}
        </Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/brand/icon.svg" />
        <meta name="msapplication-TileColor" content="#F5CA3C" />
        <meta name="msapplication-TileImage" content="/brand/icon.svg" />
        <meta name="theme-color" content="#F5CA3C" />

        {/* Structured Data */}
        <OrganizationSchema />
        <WebsiteSearchSchema />
      </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <Providers>
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
