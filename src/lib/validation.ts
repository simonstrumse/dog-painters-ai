import { z } from "zod"

export const IdTokenSchema = z.object({ idToken: z.string().min(1, "idToken required") })

export const MyGalleryRequestSchema = IdTokenSchema.extend({
  limit: z.number().int().min(1).max(200).optional(),
})

export const PrintInterestSchema = IdTokenSchema.extend({
  imageUrl: z.string().url(),
  options: z.unknown().optional(),
})

const StyleSelectionSchema = z.object({
  artistKey: z.string().min(1),
  styleKey: z.string().optional(),
  customReference: z.string().url().optional(),
})

export const GenerateFormSchema = z.object({
  selections: z.array(StyleSelectionSchema).min(1),
  size: z.string().optional(),
  quality: z.string().optional(),
  publish: z.boolean().optional(),
  idToken: z.string().min(1),
})

