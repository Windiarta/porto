import { getSanityClient, hasSanity } from "@/sanity/client";
import EducationCards from "./EducationCards.client";

type EducationItem = {
  _id: string;
  degree: string;
  school: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: Array<{ children?: Array<{ text?: string }> }>;
};

async function getData() {
  const client = getSanityClient();
  const education = hasSanity && client
    ? await client.fetch<EducationItem[]>(
      `*[_type == "education"]|order(coalesce(endDate, now()) desc){_id, degree, school, startDate, endDate, current, description}`
    )
    : ([] as EducationItem[]);
  return education;
}

export default async function Education() {
  const items = await getData();
  return (
    <section id="education" className="space-y-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase italic">Education</h2>
        <p className="text-foreground/60 max-w-xl text-lg">My academic foundation and continuous learning journey.</p>
      </div>

      {!hasSanity && (
        <div className="text-sm text-gray-500">Connect Sanity to populate education.</div>
      )}

      <EducationCards items={items} />
    </section>
  );
}

function formatDate(d: string) {
  const date = new Date(d);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}


