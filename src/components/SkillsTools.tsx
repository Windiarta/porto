import { getSanityClient, hasSanity } from "@/sanity/client";
import SkillsToolsTabs from "./SkillsToolsTabs.client";

type Category = { _id: string; title: string; slug?: { current?: string } };
type Skill = { _id: string; name: string; level?: string; categories?: Array<{ _ref: string }> };
type Tool = { _id: string; name: string; description?: string; categories?: Array<{ _ref: string }> };

async function getData() {
    const client = getSanityClient();
    if (!client || !hasSanity) {
        return { skills: [], tools: [], categories: [] };
    }

    const [skills, tools, categories] = await Promise.all([
        client.fetch<Skill[]>(`*[_type == "skill"]|order(name asc){_id, name, level, categories}`),
        client.fetch<Tool[]>(`*[_type == "tool"]|order(name asc){_id, name, description, categories}`),
        client.fetch<Category[]>(`*[_type == "category"]{_id, title, slug}`),
    ]);

    return { skills, tools, categories };
}

export default async function SkillsTools() {
    const { skills, tools, categories } = await getData();

    return (
        <section id="skills" className="space-y-12">
            <div className="flex flex-col gap-2">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase italic">Capabilities</h2>
                <p className="text-foreground/60 max-w-xl text-lg">My technical arsenal and the tools I use to bring ideas to life.</p>
            </div>

            {!hasSanity && (
                <div className="text-sm text-gray-500">Connect Sanity to populate skills and tools.</div>
            )}

            <SkillsToolsTabs
                skills={skills}
                tools={tools}
                categories={categories}
            />
        </section>
    );
}
