import { z } from "zod"

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
  object_id: z.string().nullable(),
})

export type Task = z.infer<typeof taskSchema>
