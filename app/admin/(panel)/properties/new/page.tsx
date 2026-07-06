import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PropertyForm } from "@/components/admin/property-form";

export default function NewPropertyPage() {
  return (
    <>
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft size={15} /> Volver
      </Link>
      <h1 className="mb-8 font-display text-4xl text-ink">Nueva propiedad</h1>
      <PropertyForm initial={null} />
    </>
  );
}
