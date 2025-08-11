import { getSanityClient, hasSanity } from "@/sanity/client";
import SkillsFilters from "./SkillsFilters.client";

type Category = { _id: string; title: string; slug?: { current?: string } };
type Skill = { _id: string; name: string; level?: string; categories?: Array<{ _ref: string }> };

async function getData() {
  const client = getSanityClient();
  const [skills, categories] = await Promise.all([
    hasSanity && client
      ? client.fetch<Skill[]>(
          `*[_type == "skill"]|order(name asc){_id, name, level, categories}`
        )
      : Promise.resolve([] as Skill[]),
    hasSanity && client
      ? client.fetch<Category[]>(`*[_type == "category"]{_id, title, slug}`)
      : Promise.resolve([] as Category[]),
  ]);
  return { skills, categories };
}

export default async function Skills() {
  const { skills, categories } = await getData();
  return (
    <section id="skills" className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold">Skills</h2>
      {!hasSanity && (
        <div className="text-sm text-gray-500">Connect Sanity to populate skills and categories.</div>
      )}
      <SkillsFilters skills={skills} categories={categories} />
    </section>
  );
}


