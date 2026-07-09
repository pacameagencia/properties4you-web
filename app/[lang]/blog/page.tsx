import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getPublishedPosts, type Post } from "@/lib/queries";
import { Reveal } from "@/components/site/reveal";

export const revalidate = 600;

function postContent(post: Post, locale: Locale) {
  return post.translations[locale] ?? post.translations.es ?? {};
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(isLocale(lang) ? lang : "es");
  return { title: dict.blog.title };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const posts = await getPublishedPosts();

  return (
    <section className="mx-auto max-w-5xl px-5 pb-28 pt-36 sm:px-8">
      <Reveal>
        <p className="kicker mb-5">{dict.blog.kicker}</p>
      </Reveal>
      <Reveal delay={100}>
        <h1 className="font-display text-5xl font-light text-ink sm:text-7xl">
          {dict.blog.title}
        </h1>
      </Reveal>

      <div className="mt-16 space-y-6">
        {posts.length === 0 && (
          <p className="py-20 text-center text-muted">{dict.blog.empty}</p>
        )}
        {posts.map((post, i) => {
          const c = postContent(post, locale);
          return (
            <Reveal key={post.id} delay={i * 120}>
              <Link
                href={`/${locale}/blog/${post.slug}`}
                className="group block rounded-2xl border border-line bg-surface p-8 transition-colors hover:border-gold/50"
              >
                <h2 className="font-display text-2xl text-ink transition-colors group-hover:text-gold sm:text-3xl">
                  {c.title}
                </h2>
                {c.excerpt && (
                  <p className="mt-3 max-w-2xl leading-relaxed text-muted">
                    {c.excerpt}
                  </p>
                )}
                <span className="link-underline mt-5 inline-block text-[0.75rem] uppercase tracking-[0.16em] text-gold">
                  {dict.blog.readMore} →
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
