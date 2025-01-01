import { inngest } from './client';

export const createCourseProgress = inngest.createFunction(
  { id: 'create-course-progress' },
  { event: 'courses/create.progress.record' },
  async ({ event, step, payload }) => {
    // Create initial progress record on enrollment
    // step 1 - create course progress record
    const progress = await step.run(
      'create-course-progress-record',
      async () => {
        try {
          const progress = await payload.create({
            collection: 'course-progress',
            depth: 0,
            data: {
              student: event.data.student,
              course: event.data.course,
              //startedAt: new Date().toISOString(),
              //lastAccessed: new Date().toISOString(),
              status: 'notStarted',
              overallProgress: 0,
              pointsEarned: 0,
            },
          });
          return progress;
        } catch (error) {
          throw error;
        }
      },
    );

    // step 2 - update enrollment with qhe course progress
    const enrollment = await step.run('update-enrollment-record', async () => {
      try {
        const enrollment = await payload.update({
          collection: 'enrollments',
          where: {
            id: {
              equals: event.data.id,
            },
          },
          data: {
            progress: progress,
          },
        });
        return enrollment;
      } catch (error) {
        throw error;
      }
    });

    return {
      message: `Initial progress record on enrollment created successful!`,
      enrollmentId: enrollment.docs[0].id,
      progressId: progress.id,
    };
  },
);
