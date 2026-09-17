import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PropertyForm } from "@/components/admin/property-form";
import { TranslationWarning } from "@/components/admin/translation-warning";
import { translationConfigStatus } from "@/lib/translate";

export default function NewPropertyPage() {
  const translation = translationConfigStatus();

  return (
    <>
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft size={15} /> Volver
      </Link>
      <h1 className="mb-8 font-display text-4xl text-ink">Nueva propiedad</h1>
      <TranslationWarning problems={translation.problems} />
      <PropertyForm initial={null} />
    </>
  );
}
