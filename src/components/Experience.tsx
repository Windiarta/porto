import { getSanityClient, hasSanity } from "@/sanity/client";
import ClientFilters from "./ExperienceFilters.client";

type Experience = {
  _id: string;
  role: string;
  company: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: Array<{ children?: Array<{ text?: string }> }>;
  categories?: Array<{ _ref: string }>;
};

async function getData() {
  const client = getSanityClient();
  const [experiences, categories] = await Promise.all([
    hasSanity && client
      ? client.fetch<Experience[]>(
          `*[_type == "experience"]|order(startDate desc){_id, role, company, startDate, endDate, current, description, categories}`
        )
      : Promise.resolve([] as Experience[]),
    hasSanity && client
      ? client.fetch<{ _id: string; title: string; slug: { current: string } }[]>(
          `*[_type == "category"]{_id, title, slug}`
        )
      : Promise.resolve([] as { _id: string; title: string; slug: { current: string } }[]),
  ]);
  const categoryMap = new Map(categories.map((c) => [c._id, c]));
  return { experiences, categoryMap };
}

export default async function Experience() {
  const { experiences, categoryMap } = await getData();
  return (
    <section id="experience" className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold">Experience</h2>
      </div>
      {!hasSanity && (
        <div className="text-sm text-gray-500">Connect Sanity to populate experiences and filters.</div>
      )}
      <ClientFilters categories={[...categoryMap.values()]} experiences={experiences} />
    </section>
  );
}
// ClientFilters is a client component imported directly


