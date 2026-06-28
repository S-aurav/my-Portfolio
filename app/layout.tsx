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

import { publicApi } from "@/lib/api";
import { ProfileProvider } from "@/context/ProfileContext";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let profile = null;
  try {
    const res = await publicApi.getProfile();
    if (res?.success && res?.data) {
      profile = res.data;
    }
  } catch (err) {
    console.error("Failed to fetch profile in root layout:", err);
  }

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var savedTheme = localStorage.getItem('theme');
              var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
                document.documentElement.setAttribute('data-theme', 'dark');
              } else {
                document.documentElement.setAttribute('data-theme', 'light');
              }
            } catch (e) {}
          })();
        `}} />
      </head>
      <body className="antialiased">
        <ProfileProvider initialData={profile}>
          {children}
        </ProfileProvider>
      </body>
    </html>
  );
}
