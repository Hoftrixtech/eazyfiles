export type AdsSurface = "public" | "account" | "auth";

/** Ads are not implemented yet. This only documents where they may appear later. */
export function allowsFutureAds(input: { surface: AdsSurface }): boolean {
  return input.surface === "public";
}
