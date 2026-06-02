export const siteName = "Scale Aid";

export const siteDescription =
  "Scale Aid ist ein Gitarren-Lerntool zum Üben und Verstehen von Skalen auf dem Griffbrett.";

const fallbackSiteUrl = "http://localhost:3000";

export function getSiteUrl() {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  try {
    return new URL(configuredSiteUrl || fallbackSiteUrl);
  } catch {
    return new URL(fallbackSiteUrl);
  }
}