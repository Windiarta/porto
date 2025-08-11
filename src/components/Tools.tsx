import { getSanityClient, hasSanity } from "@/sanity/client";
import ToolsFilters from "./ToolsFilters.client";

type Category = { _id: string; title: string; slug?: { current?: string } };
type Tool = { _id: string; name: string; description?: string; categories?: Array<{ _ref: string }> };

async function getData() {
  const client = getSanityClient();
  const [tools, categories] = await Promise.all([
    hasSanity && client
      ? client.fetch<Tool[]>(`*[_type == "tool"]|order(name asc){_id, name, description, categories}`)
      : Promise.resolve([] as Tool[]),
    hasSanity && client
      ? client.fetch<Category[]>(`*[_type == "category"]{_id, title, slug}`)
      : Promise.resolve([] as Category[]),
  ]);
  return { tools, categories };
}

export default async function Tools() {
  const { tools, categories } = await getData();
  return (
    <section id="tools" className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold">Tools</h2>
      {!hasSanity && (
        <div className="text-sm text-gray-500">Connect Sanity to populate tools and categories.</div>
      )}
      <ToolsFilters tools={tools} categories={categories} />
    </section>
  );
}


