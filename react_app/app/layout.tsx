import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ViewTransitions } from "next-view-transitions";
import type { Viewport } from "next";
import { NavBar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Script from "next/script";
import { ClientAnalytics } from "@/lib/ClientAnalytics";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: 'AlertMend | Automate Kubernetes Incident Management',
  description:
    'AlertMend automates Kubernetes incident management with AI-driven workflows, reducing downtime and boosting operational efficiency across AKS, EKS, and GKE.',
  keywords:
    'Kubernetes incident management, Kubernetes automation, AI-driven incident management, AKS, EKS, GKE, DevOps automation, SRE automation, cloud-native, SaaS',
  authors: [{ name: 'AlertMend' }],
  creator: 'AlertMend',
  publisher: 'AlertMend',
  applicationName: 'AlertMend',
  metadataBase: new URL('https://www.alertmend.io'),
  openGraph: {
    title: 'AlertMend | Automate Kubernetes Incident Management',
    description:
      'Minimize downtime and boost efficiency with AI-driven Kubernetes incident management, offering automated remediation and RCA features.',
    url: 'https://www.alertmend.io',
    siteName: 'AlertMend',
    images: [
      {
        url: 'https://www.alertmend.io/img/alertmend_logo.jpg',
        width: 1200,
        height: 630,
        alt: 'AlertMend Logo',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AlertMend | Automate Kubernetes Incident Management',
    description:
      'AI-driven Kubernetes incident management with automated remediation, RCA insights, and support for AKS, EKS, and GKE.',
    images: ['https://www.alertmend.io/img/alertmend_logo.jpg'],
  },
  icons: {
    icon: '/img/favicon.png',
    shortcut: '/img/favicon.png',
    apple: [
      { url: '/img/favicon.ico', sizes: '144x144' },
      { url: '/img/favicon.ico', sizes: '114x114' },
      { url: '/img/favicon.png', sizes: '75x75' },
      { url: '/img/favicon.png' },
    ],
  },
  // REMOVED themeColor and viewport from metadata - they belong in viewport export
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': '#E2000F',
    'language': 'english',
    'no-email-collection': 'http://www.unspam.com/noemailcollection/',
  },
  alternates: {
    canonical: 'https://www.alertmend.io/',
  },
}

// Consolidate all viewport settings here
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#E2000F" },
    { media: "(prefers-color-scheme: dark)", color: "#E2000F" },
  ],
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en">
        <head>
          {/* Preconnect + Fonts */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
            rel="stylesheet"
          />

          {/* JSON-LD Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'AlertMend',
                url: 'https://www.alertmend.io',
                logo: 'https://www.alertmend.io/img/alertmend_logo.jpg',
                description:
                  'AlertMend automates Kubernetes incident management with AI-driven workflows, reducing downtime and boosting operational efficiency.',
                sameAs: ['https://www.linkedin.com/company/alertmend'],
              }),
            }}
          />
        </head>

        <body
          className={cn(
            inter.className,
            "bg-charcoal antialiased h-full w-full"
          )}
        >
          {/* Google Analytics */}
          <Script
            async
            strategy="afterInteractive"
            src="https://www.googletagmanager.com/gtag/js?id=G-Z8QSJ5NK95"
          />
          <Script
            id="gtag-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-Z8QSJ5NK95');
              `,
            }}
          />
          <Suspense>
            <ClientAnalytics />
          </Suspense>
          <NavBar />
          {children}
          <Footer />
        </body>
      </html>
    </ViewTransitions>
  );
}
