import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/app/lib/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    host: siteUrl.origin,
    sitemap: `${siteUrl.origin}/sitemap.xml`,
  };
}