import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Property } from "@/lib/types";
import { PropertyForm } from "@/components/admin/property-form";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const property = data as Property;

  return (
    <>
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft size={15} /> Volver
      </Link>
      <h1 className="mb-8 font-display text-4xl text-ink">{property.name}</h1>
      <PropertyForm initial={property} />
    </>
  );
}
