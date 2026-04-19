import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ParticleBackground from "@/components/ParticleBackground";
import Navbar from "@/components/Navbar";
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Index'});
  const baseUrl = 'https://spaceryz.vercel.app';
 
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: t('title'),
      template: `%s | ${t('title')}`
    },
    verification: {
      google: "e7_Fp6RI0cbAjk9lb6RLEj8VTmEaVDktOFRTMzhCiCM",
    },
    description: t('description'),
    keywords: ["free online tools", "image compressor", "pdf to word", "png to jpg", "video editor online", "developer tools", "spacery"],
    authors: [{ name: "Spacery Laboratory" }],
    creator: "Spacery",
    publisher: "Spacery",
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'en': `${baseUrl}/en`,
        'id': `${baseUrl}/id`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === 'en' ? 'en_US' : 'id_ID',
      url: `${baseUrl}/${locale}`,
      title: t('title'),
      description: t('description'),
      siteName: "Spacery",
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: "Spacery Digital Laboratory",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t('title'),
      description: t('description'),
      images: ['/og-image.png'],
      creator: "@spacery",
    },
  };
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Spacery Digital Laboratory",
              "operatingSystem": "Web",
              "applicationCategory": "MultimediaApplication, DesignApplication, DeveloperApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "A comprehensive suite of free online tools for image processing, video editing, PDF management, and developer utilities."
            })
          }}
        />
      </head>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <ParticleBackground />
          <Navbar />
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
