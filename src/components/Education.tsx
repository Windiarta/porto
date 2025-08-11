import { getSanityClient, hasSanity } from "@/sanity/client";

type EducationItem = {
  _id: string;
  degree: string;
  school: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
};

async function getData() {
  const client = getSanityClient();
  const education = hasSanity && client
    ? await client.fetch<EducationItem[]>(
        `*[_type == "education"]|order(startDate desc){_id, degree, school, startDate, endDate, current}`
      )
    : ([] as EducationItem[]);
  return education;
}

export default async function Education() {
  const items = await getData();
  return (
    <section id="education" className="space-y-6">
      <h2 className="text-2xl md:text-3xl font-bold">Education</h2>
      {!hasSanity && (
        <div className="text-sm text-gray-500">Connect Sanity to populate education.</div>
      )}
      <div className="space-y-4">
        {items.map((e) => (
          <div key={e._id} className="p-4 border rounded-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{e.degree}</h3>
              <span className="text-sm text-gray-500">
                {formatDate(e.startDate)} - {e.current ? "Present" : e.endDate ? formatDate(e.endDate) : ""}
              </span>
            </div>
            <div className="text-gray-600 text-sm">{e.school}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function formatDate(d: string) {
  const date = new Date(d);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}


