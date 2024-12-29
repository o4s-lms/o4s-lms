import { inngest } from './client';

export const helloWorld = inngest.createFunction(
  { id: 'hello-world' },
  { event: 'test/hello.world' },
  async ({ event, step }) => {
    await step.sleep('wait-a-moment', '1s');
    return { message: `Hello ${event.data.email}!` };
  },
);

export const lastLogin = inngest.createFunction(
  { id: 'last-login' },
  { event: 'users/last.login' },
  async ({ event, step, payload, logger }) => {
    // step 1
    const result = await step.run('update-last-login', async () => {
      try {
        await payload.update({
          collection: 'users',
          depth: 0,
          where: {
            id: {
              equals: event.data.userId,
            },
          },
          data: {
            lastLogin: new Date().toISOString(),
          },
        });
        return {
          message: 'User last login updated',
          userId: event.data.userId,
        };
      } catch (error) {
        logger.error('Failed to update last login:', error);
        throw error;
      }
    });
    return result;
  },
);

export const lastLessonAccess = inngest.createFunction(
  { id: 'last-lesson-access' },
  { event: 'lessons/last.lesson.access' },
  async ({ event, step, payload, logger }) => {
    // step 1
    const result = await step.run('update-last-lesson-access', async () => {
      try {
        await payload.update({
          collection: 'lesson-progress',
          depth: 0,
          where: {
            and: [
              {
                student: {
                  equals: event.data.userId,
                },
              },
              {
                lesson: {
                  equals: event.data.lessonId,
                },
              },
            ],
          },
          data: {
            lastAccessed: new Date().toISOString(),
          },
        });
        return {
          message: 'Lesson last access updated',
          user: event.data.userId,
          lesson: event.data.lessonId,
        };
      } catch (error) {
        logger.error('Failed to update lesson last access:', error);
        throw error;
      }
    });
    return result;
  },
);

export const lessonCompleted = inngest.createFunction(
  { id: 'lesson-completed' },
  { event: 'lessons/lesson.completed' },
  async ({ event, step, payload, logger }) => {
    // step 1
    const lessonProgress = await step.run(
      'update-lesson-completed',
      async () => {
        try {
          const result = await payload.update({
            collection: 'lesson-progress',
            depth: 0,
            where: {
              and: [
                {
                  student: {
                    equals: event.data.userId,
                  },
                },
                {
                  lesson: {
                    equals: event.data.lessonId,
                  },
                },
              ],
            },
            data: {
              completed: true,
              completedAt: new Date().toISOString(),
            },
          });
          return result;
        } catch (error) {
          logger.error('Failed to update lesson completed:', error);
          throw error;
        }
      },
    );
    // step 2
    const courseProgress = await step.run(
      'update-course-progress',
      async () => {
        try {
          const result = await payload.update({
            collection: 'course-progress',
            depth: 0,
            where: {
              and: [
                {
                  student: {
                    equals: event.data.userId,
                  },
                },
                {
                  course: {
                    equals: event.data.courseId,
                  },
                },
              ],
            },
            data: {
              completedLessons: event.data.lessonId,
              lastAccessed: new Date().toISOString(),
            },
          });
          return result;
        } catch (error) {
          logger.error('Failed to update course progress:', error);
          throw error;
        }
      },
    );
    // step 3
    const overallProgress = await step.run(
      'update-overall-progress',
      async () => {
        try {
          const { totalDocs } = await payload.count({
            collection: 'lessons',
            where: {
              and: [
                {
                  _status: {
                    equals: 'published',
                  },
                },
                {
                  course: {
                    equals: event.data.courseId,
                  },
                },
              ],
            },
          });
          const numCompletedLessons =
            courseProgress.docs[0].completedLessons?.length ?? 0;
          if (totalDocs === 0) {
            return 0;
          }

          const rawProgress = (numCompletedLessons / totalDocs) * 100;
          const progress = Math.min(
            100,
            Math.max(0, Math.round(rawProgress * 10) / 10),
          );

          await payload.update({
            collection: 'course-progress',
            depth: 0,
            where: {
              and: [
                {
                  student: {
                    equals: event.data.userId,
                  },
                },
                {
                  course: {
                    equals: event.data.courseId,
                  },
                },
              ],
            },
            data: {
              overallProgress: progress,
            },
          });
          return progress;
        } catch (error) {
          logger.error('Failed to update overall progress:', error);
          throw error;
        }
      },
    );

    return {
      lessonProgress: lessonProgress.docs[0],
      courseOverallProgress: overallProgress,
    };
  },
);
