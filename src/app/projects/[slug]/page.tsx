import { getSanityClient, hasSanity } from "@/sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "@/sanity/client";
import Link from "next/link";
import Parallax from "@/components/Parallax";

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
  return builder.image(source as { asset?: { _ref?: string } }).width(2000).height(1200).fit("max").url();
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
      <div className="max-w-4xl mx-auto py-32 px-6 text-center">
        <h1 className="text-4xl font-black">Project not found</h1>
        <Link href="/" className="mt-8 inline-block underline decoration-accent text-accent font-bold">Return Home</Link>
      </div>
    );
  }

  const coverUrl = urlFor(project.cover);

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Ambient Background Glows */}
      <div className="glow-primary opacity-20" />

      <div className="max-w-6xl mx-auto px-6 pt-10 pb-20 space-y-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-foreground/40 hover:text-accent transition-colors group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> BACK TO EXPLORATION
        </Link>

        <header className="space-y-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] uppercase italic">
            {project.title}
          </h1>
          <div className="flex flex-wrap gap-3">
            {project.tech?.map((t, i) => (
              <span key={i} className="px-4 py-1.5 rounded-full text-xs font-black bg-accent/10 border border-accent/20 text-accent uppercase tracking-widest">
                {t}
              </span>
            ))}
          </div>
        </header>

        {coverUrl && (
          <div className="relative w-full aspect-[21/9] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
            <Parallax offset={40} className="w-full h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverUrl} alt={project.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </Parallax>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-16 pt-8">
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-black uppercase italic tracking-tight text-accent">The Project</h2>
            <p className="text-foreground/70 text-lg md:text-xl leading-relaxed whitespace-pre-line font-medium">
              {project.description}
            </p>
          </div>

          <div className="space-y-10">
            <div className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-6">
              <h3 className="font-black uppercase tracking-widest text-xs text-foreground/40">Deployment</h3>
              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-2xl font-black bg-foreground text-background hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  LIVE PREVIEW
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 22 3 22 10"></polyline>
                    <line x1="10" y1="14" x2="22" y2="2"></line>
                  </svg>
                </a>
              ) : (
                <div className="space-y-3">
                  <button className="w-full px-6 py-4 rounded-2xl font-black bg-white/5 text-foreground/20 cursor-not-allowed border border-white/5" disabled>
                    PREVIEW RESTRICTED
                  </button>
                  <p className="text-[10px] text-accent/50 font-bold text-center uppercase tracking-widest leading-loose">
                    Confidential or strictly internal use only.
                  </p>
                </div>
              )}
            </div>

            <div className="glass p-8 rounded-[2.5rem] border border-white/5 space-y-4">
              <h3 className="font-black uppercase tracking-widest text-xs text-foreground/40">Core Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.tech?.map((t, i) => (
                  <div key={i} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] font-bold text-foreground/60">{t}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



