import { TOOLS } from "@/data/tools";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const tool = TOOLS.find((t) => t.slug === slug);
  const t = await getTranslations({ locale, namespace: "ToolsData" });

  if (!tool) return {};

  const title = t(`${slug}.title`);
  const description = t(`${slug}.desc`);
  const baseUrl = "https://spaceryz.vercel.app";

  return {
    title: title,
    description: description,
    openGraph: {
      title: `${title} | Spacery Digital Lab`,
      description: description,
      url: `${baseUrl}/${locale}/tools/${slug}`,
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/tools/${slug}`,
      languages: {
        en: `${baseUrl}/en/tools/${slug}`,
        id: `${baseUrl}/id/tools/${slug}`,
      },
    },
  };
}

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
