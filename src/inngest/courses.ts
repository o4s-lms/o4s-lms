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

export const computeCourseProgress = inngest.createFunction(
  { id: 'compute-course-progress' },
  { event: 'courses/compute.course.progress' },
  async ({ event, step, payload }) => {
    // step 1 - num lessons
    const lessons = await step.run('get-num-lessons', async () => {
      try {
        const lessons = await payload.count({
          collection: 'lessons',
          where: {
            and: [
              {
                course: {
                  equals: event.data.courseId,
                },
              },
              {
                _status: {
                  equals: 'published',
                },
              },
            ],
          },
        });

        return lessons.totalDocs;
      } catch (error) {
        throw error;
      }
    });
    // step 2 - num lessons completed
    const lessonsCompleted = await step.run(
      'get-num-lessons-completed',
      async () => {
        try {
          const progress = await payload.count({
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
                  course: {
                    equals: event.data.courseId,
                  },
                },
                {
                  completed: {
                    equals: true,
                  },
                },
              ],
            },
          });

          return progress.totalDocs;
        } catch (error) {
          throw error;
        }
      },
    );

    const rawProgress = (lessonsCompleted / lessons) * 100;
    const progress = Math.min(
      100,
      Math.max(0, Math.round(rawProgress * 10) / 10),
    );

    // step 3 - update course progress
    const courseProgress = await step.run(
      'update-course-progress',
      async () => {
        try {
          const courseProgress = await payload.update({
            collection: 'course-progress',
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
          return courseProgress.docs[0];
        } catch (error) {
          throw error;
        }
      },
    );

    return {
      message: `Course progress updated successful!`,
      courseProgress: courseProgress.overallProgress,
    };
  },
);
