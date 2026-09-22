import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/queries";
import { PostForm } from "@/components/admin/post-form";
import { TranslationWarning } from "@/components/admin/translation-warning";
import { translationConfigStatus } from "@/lib/translate";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const post = data as Post;

  return (
    <>
      <Link
        href="/admin/guia"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft size={15} /> Volver a la Guía
      </Link>
      <h1 className="mb-8 font-display text-4xl text-ink">
        {post.translations?.es?.title || post.slug}
      </h1>
      <TranslationWarning problems={translationConfigStatus().problems} />
      <PostForm initial={post} />
    </>
  );
}
