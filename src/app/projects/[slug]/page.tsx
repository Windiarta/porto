import { getSanityClient, hasSanity } from "@/sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "@/sanity/client";
import Link from "next/link";

type Project = {
  _id: string;
  title: string;
  description: string;
  url?: string;
  cover?: { asset?: { _ref?: string } };
  categories?: Array<{ _ref: string }>;
  tech?: string[];
  slug?: { current?: string };
};

function urlFor(source: { asset?: { _ref?: string } } | undefined): string | undefined {
  if (!hasSanity || !projectId || !source) return undefined;
  const builder = imageUrlBuilder({ projectId, dataset });
  return builder.image(source as { asset?: { _ref?: string } }).width(1200).height(800).fit("max").url();
}

export default async function ProjectPage(props: unknown) {
  const { params } = (props as { params: { slug: string } }) ?? { params: { slug: "" } };
  let project: Project | null = null;
  if (hasSanity && getSanityClient()) {
    project = await getSanityClient()!.fetch<Project | null>(
      `*[_type == "project" && slug.current == $slug][0]{_id, title, description, url, cover, categories, tech, slug}`,
      { slug: params.slug }
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-6">
        <h1 className="text-2xl font-bold">Project not found</h1>
      </div>
    );
  }

  const coverUrl = urlFor(project.cover);

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 space-y-6">
      <Link href="/" className="text-sm underline">← Back</Link>
      <h1 className="text-3xl md:text-4xl font-extrabold">{project.title}</h1>
      {coverUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={coverUrl} alt={project.title} className="w-full rounded-2xl border" />
      )}
      <p className="text-gray-600 whitespace-pre-line">{project.description}</p>
      {project.tech && project.tech.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {project.tech.map((t, i) => (
            <span key={i} className="px-2 py-1 rounded-full text-xs bg-gray-100 border">{t}</span>
          ))}
        </div>
      )}
      <div>
        {project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="inline-block px-5 py-3 rounded-xl font-semibold bg-black text-white hover:opacity-90"
          >
            Visit Link
          </a>
        ) : (
          <button className="px-5 py-3 rounded-xl font-semibold bg-gray-300 text-gray-700 cursor-not-allowed" disabled>
            Visit Link
          </button>
        )}
        {!project.url && (
          <div className="text-sm text-red-500 mt-2">URL is restricted or not available.</div>
        )}
      </div>
    </div>
  );
}


