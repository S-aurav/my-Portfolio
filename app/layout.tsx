import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Saurav Yadav — Software Engineer",
  description:
    "Full-stack software engineer specializing in Java/Spring Boot, FastAPI, and cloud-native backend systems. Currently at Dista.ai, building enterprise-grade APIs and geospatial data pipelines.",
  keywords: [
    "Saurav Yadav",
    "Software Engineer",
    "Full Stack Developer",
    "Java Developer",
    "Spring Boot",
    "FastAPI",
    "Portfolio",
    "Pune",
    "India",
  ],
  authors: [{ name: "Saurav Yadav" }],
  creator: "Saurav Yadav",
  openGraph: {
    title: "Saurav Yadav — Software Engineer",
    description:
      "Full-stack software engineer building robust backend systems, clean APIs, and scalable architectures.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saurav Yadav — Software Engineer",
    description:
      "Full-stack software engineer building robust backend systems, clean APIs, and scalable architectures.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
