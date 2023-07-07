import { createOperation, z } from '../../generated/wundergraph.factory'
import { OperationError } from '@wundergraph/sdk/operations'

export class LessonProgressError extends OperationError {
  statusCode = 400;
  code = 'LessonProgressError' as const;
  message = 'Lesson progress query error';
}

export class LessonsError extends OperationError {
  statusCode = 400;
  code = 'LessonsError' as const;
  message = 'Lessons query error';
}

export default createOperation.query({
	input: z.object({
		course_id: z.string(),
  }),
	handler: async ({ input, user, graph }) => {
		const progress = await graph
			.from('lms')
			.query('findManyLessonProgress')
			.where({
				where: {
					user_uuid: user?.userId as string,
					course_id: input.course_id,
				}
			})
			.exec()
		if (!progress) {
			throw new LessonProgressError()
		}
		const num_completed: number = progress.length
		if (num_completed > 0) {
			const lessons = await graph
			.from('lms')
			.query('findManyLesson')
			.where({
				where: {
					course_id: input.course_id,
					deleted: false,
					status: 'published'
				}
			})
			.exec()
			if (!lessons) {
				throw new LessonsError()
			}
			const num_lessons: number = lessons.length
			const progress: number = Math.round(num_completed / num_lessons * 100)
			/**await graph
				.from('lms')
				.query('updateOneCourseMember')
				.where({
					where: {
						user_uuid: user?.userId as string,
						course_id: input.course_id,
					},
					data: {
						progress: { set: progress },
					},
				})
				.exec()*/
			return {
				progress: progress,
			}
		}
		return {
			progress: 0,
		}
	},
})