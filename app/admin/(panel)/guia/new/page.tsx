import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PostForm } from "@/components/admin/post-form";
import { TranslationWarning } from "@/components/admin/translation-warning";
import { translationConfigStatus } from "@/lib/translate";

export default function NewPostPage() {
  return (
    <>
      <Link
        href="/admin/guia"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft size={15} /> Volver a la Guía
      </Link>
      <h1 className="mb-8 font-display text-4xl text-ink">Nuevo artículo</h1>
      <TranslationWarning problems={translationConfigStatus().problems} />
      <PostForm initial={null} />
    </>
  );
}
