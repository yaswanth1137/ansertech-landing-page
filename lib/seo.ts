export const SITE_URL = "https://ansertech.com";

/** Builds an absolute canonical/OG URL for a given path off the single site domain. */
export function siteUrl(path: string = "/"): string {
    return new URL(path, SITE_URL).toString();
}
