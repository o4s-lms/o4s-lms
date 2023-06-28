import { createOperation, z } from '../../generated/wundergraph.factory'
import { OperationError } from '@wundergraph/sdk/operations'

export class LessonProgressError extends OperationError {
  statusCode = 500;
  code = 'LessonProgressError' as const;
  message = 'Lesson progress query error';
}

export class LessonsError extends OperationError {
  statusCode = 500;
  code = 'LessonsError' as const;
  message = 'Lessons query error';
}

export default createOperation.query({
	input: z.object({
		course_id: z.string(),
  }),
	handler: async ({ input, user, graph }) => {
		const status = await graph
			.from('lms')
			.query('groupByTask')
			.where({
				by: ['status'],
				where: {
					course_id: input.course_id,
					created_by: user?.userId as string,
				},
				select: {
					_count: {
						status: true,
					},
				},
			})
			.exec()
		return status
	},
})