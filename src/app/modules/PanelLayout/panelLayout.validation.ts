import { z } from "zod"

const panelNodeSchema: z.ZodTypeAny = z.lazy(() =>
  z.union([
    z.object({
      id: z.number().int().nonnegative(),
      type: z.literal("leaf"),
      color: z.string().min(1),
    }),
    z.object({
      id: z.number().int().nonnegative(),
      type: z.literal("split"),
      direction: z.enum(["v", "h"]),
      sizes: z.tuple([
        z.number().min(1).max(99),
        z.number().min(1).max(99),
      ]),
      children: z.tuple([panelNodeSchema, panelNodeSchema]),
    }),
  ])
)

const upsertLayoutValidationSchema = z.object({
  layout: panelNodeSchema,
})

export const PanelLayoutValidation = {
  upsertLayoutValidationSchema,
}
