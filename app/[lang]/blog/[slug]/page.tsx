import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getPostBySlug, getPublishedPosts, type Post } from "@/lib/queries";

export const revalidate = 600;

function postContent(post: Post, locale: Locale) {
  return post.translations[locale] ?? post.translations.es ?? {};
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = isLocale(lang) ? lang : "es";
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Blog" };
  const c = postContent(post, locale);
  return { title: c.title, description: c.excerpt };
}

/** Render mínimo de markdown ligero: ## títulos, **negrita**, listas y párrafos. */
function renderBody(body: string) {
  return body.split(/\n\n+/).map((block, i) => {
    const b = block.trim();
    if (b.startsWith("## ")) {
      return (
        <h2 key={i} className="mt-10 font-display text-2xl text-ink sm:text-3xl">
          {b.slice(3)}
        </h2>
      );
    }
    if (/^(-|\d+\.)\s/.test(b)) {
      const items = b.split("\n").map((l) => l.replace(/^(-|\d+\.)\s+/, ""));
      return (
        <ul key={i} className="mt-4 space-y-2">
          {items.map((it, j) => (
            <li key={j} className="flex items-start gap-3 text-muted">
              <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
              <span dangerouslySetInnerHTML={{ __html: inline(it) }} />
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p
        key={i}
        className="mt-4 leading-relaxed text-muted"
        dangerouslySetInnerHTML={{ __html: inline(b) }}
      />
    );
  });
}

function inline(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-ink">$1</strong>');
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const c = postContent(post, locale);

  return (
    <article className="mx-auto max-w-3xl px-5 pb-28 pt-36 sm:px-8">
      <Link
        href={`/${locale}/blog`}
        className="mb-10 inline-flex items-center gap-2 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft size={15} /> {dict.blog.back}
      </Link>
      <p className="kicker mb-5">{dict.blog.kicker}</p>
      <h1 className="font-display text-4xl font-light leading-tight text-ink sm:text-6xl">
        {c.title}
      </h1>
      {c.excerpt && (
        <p className="mt-6 border-l-2 border-gold/50 pl-5 text-lg leading-relaxed text-muted">
          {c.excerpt}
        </p>
      )}
      <div className="mt-10">{c.body ? renderBody(c.body) : null}</div>

      <div className="mt-16 rounded-2xl border border-line bg-surface p-8 text-center">
        <h3 className="font-display text-2xl text-ink">{dict.cta.title}</h3>
        <Link
          href={`/${locale}/propiedades`}
          className="mt-5 inline-block rounded-full bg-gold px-8 py-3.5 text-[0.75rem] uppercase tracking-[0.16em] text-bg"
        >
          {dict.hero.ctaProperties}
        </Link>
      </div>
    </article>
  );
}
