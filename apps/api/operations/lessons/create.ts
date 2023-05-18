import slugify from '@sindresorhus/slugify';
import { createOperation, z } from '../../generated/wundergraph.factory';

export default createOperation.mutation({
  input: z.object({
		name: z.string(),
    courseId: z.number(),
    moduleId: z.number(),
  }),
  handler: async ({ user, input, graph }) => {
		const userId = String(user?.userId);
		const lesson = await graph
			.from('lms')
			.mutate('createOneLesson')
			.where({
				name: input.name,
				slug: slugify(input.name),
				courseId: input.courseId,
				moduleId: input.moduleId,
				createdBy: userId,
			})
			.exec();
		return lesson;
  },
});