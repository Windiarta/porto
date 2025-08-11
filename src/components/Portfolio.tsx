import { getSanityClient, hasSanity, projectId, dataset } from "@/sanity/client";
import imageUrlBuilder from "@sanity/image-url";
// import Link from "next/link";
import ClientFilters from "./PortfolioFilters.client";

type Category = { _id: string; title: string; slug: { current: string } };
type Project = {
  _id: string;
  title: string;
  description: string;
  url?: string;
  cover?: { asset?: { _ref?: string } };
  categories?: Array<{ _ref: string }>;
};

function urlFor(source: { asset?: { _ref?: string } } | undefined): string | undefined {
  if (!hasSanity || !projectId || !source) return undefined;
  const builder = imageUrlBuilder({ projectId, dataset });
  return builder.image(source as { asset?: { _ref?: string } }).width(800).height(600).fit("crop").url();
}

async function getData() {
  const [projects, categories] = await Promise.all([
    hasSanity && getSanityClient()
      ? getSanityClient()!.fetch<Project[]>(
          `*[_type == "project"]{_id, title, description, url, cover, categories}`
        )
      : Promise.resolve([] as Project[]),
    hasSanity && getSanityClient()
      ? getSanityClient()!.fetch<Category[]>(`*[_type == "category"]{_id, title, slug}`)
      : Promise.resolve([] as Category[]),
  ]);
  return { projects, categories };
}

export default async function Portfolio() {
  const { projects, categories } = await getData();
  return (
    <section id="portfolio" className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold">Featured Projects</h2>
      {!hasSanity && (
        <div className="text-sm text-gray-500">Connect Sanity to populate projects and categories.</div>
      )}
      <ClientFilters
        categories={categories}
        projects={projects.map((p) => ({ ...p, coverUrl: p.cover ? urlFor(p.cover) : undefined }))}
      />
    </section>
  );
}

// ClientFilters is a client component imported directly


