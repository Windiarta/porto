import { createClient, type SanityClient } from "next-sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const hasSanity = Boolean(projectId && /^[a-z0-9-]+$/.test(projectId));

export function getSanityClient(): SanityClient | null {
  if (!hasSanity || !projectId) return null;
  return createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    useCdn: process.env.NODE_ENV === "production", // Only use CDN in production
  });
}


