import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/app/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  return [
    {
      url: new URL("/", siteUrl).toString(),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: new URL("/basic-scales", siteUrl).toString(),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}