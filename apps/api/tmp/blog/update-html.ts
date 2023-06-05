/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createOperation, z } from '../../generated/wundergraph.factory'
import readingTime from 'reading-time'
import converter from '@tryghost/html-to-mobiledoc'

export default createOperation.mutation({
  input: z.object({
		id: z.string().nonempty(),
		html: z.string().nonempty(),
  }),
  handler: async ({ input, graph }) => {
		const stats = readingTime(input.html)
		const mobiledoc = converter.toMobiledoc(input.html)
		const post = await graph
			.from('site')
			.mutate('updateOnePost')
			.where({ where: { id: input.id },
				data: {
					mobiledoc: mobiledoc,
					html: input.html,
					est_reading_time: stats.minutes,
				}
			})
			.exec()
		return post
  },
})