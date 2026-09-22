import { z } from "zod";

export const settingsSchema = z.object({
  contact_email: z.string().trim().email("Introduce un email válido.").max(200),
  contact_phone: z.string().trim().max(50),
  address: z.string().trim().min(1, "Indica la dirección de contacto.").max(500),
});
