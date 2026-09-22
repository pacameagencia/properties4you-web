import { z } from "zod";

export const enquirySchema = z.object({
  kind: z.enum(["visita", "contacto", "colabora"]),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  preferredDate: z
    .string()
    .refine((value) => z.iso.date().safeParse(value).success, "Introduce una fecha válida.")
    .optional()
    .or(z.literal("")),
  propertyId: z.string().uuid().optional().or(z.literal("")),
  propertyName: z.string().trim().max(200).optional().or(z.literal("")),
  propertyUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
  agency: z.string().trim().max(160).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  website: z.string().trim().max(200).optional().or(z.literal("")),
  locale: z.enum(["es", "en", "de", "nl", "fr"]),
  consent: z.literal(true),
  /** Honeypot: los humanos no lo ven; si viene relleno es un bot. */
  company: z.string().max(0).optional().or(z.literal("")),
}).superRefine((value, ctx) => {
  if (value.kind === "colabora" && !value.agency) ctx.addIssue({code: "custom", path: ["agency"], message: "Indica tu agencia."});
  if (value.kind === "colabora" && !value.country) ctx.addIssue({code: "custom", path: ["country"], message: "Indica tu país."});
  if (value.kind === "contacto" && !value.message) ctx.addIssue({code: "custom", path: ["message"], message: "Escribe un mensaje."});
  if (leadMessage(value).length > 2000) ctx.addIssue({code: "custom", path: ["message"], message: "El mensaje completo supera los 2.000 caracteres."});
});

export function leadMessage(d: {kind: string; agency?: string; country?: string; website?: string; message?: string}): string {
  return [
    d.kind === "colabora" && d.agency && `Agencia: ${d.agency}`,
    d.kind === "colabora" && d.country && `País: ${d.country}`,
    d.kind === "colabora" && d.website && `Web: ${d.website}`,
    d.message,
  ].filter(Boolean).join("\n");
}

export type EnquiryInput = z.input<typeof enquirySchema>;
