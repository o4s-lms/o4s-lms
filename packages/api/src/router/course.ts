import slugify from "@sindresorhus/slugify";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc";

export const courseRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.lms.course.findMany({ orderBy: { id: "desc" } });
  }),
  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.lms.course.findFirst({
        where: {
          id: input.id,
          deleted: false,
        },
        select: {
          id: true,
          name: true,
          published: true,
          members: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
              role: true,
            },
          },
          modules: {
            where: { deleted: false },
            orderBy: { pos: "asc" },
            select: {
              id: true,
              name: true,
              pos: true,
              courseId: true,
              lessons: {
                where: { deleted: false },
                orderBy: { pos: "asc" },
                select: {
                  id: true,
                  name: true,
                  pos: true,
                  status: true,
                  courseId: true,
                  moduleId: true,
                },
              },
            },
          },
        },
      });
    }),
  byAuthor: adminProcedure.query(({ ctx }) => {
    return ctx.lms.course.findMany({
      where: {
        createdBy: ctx.session.user.id,
        deleted: false,
      },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        published: true,
        _count: {
          select: {
            modules: true,
            lessons: true,
            members: true,
          },
        },
      },
    });
  }),
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1).max(1000),
        image: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      const id = String(ctx.session?.user?.id);
      return ctx.lms.course.create({
        data: {
          name: input.name,
          description: input.description,
          slug: slugify(input.name),
          image: input.image,
          createdBy: id,
					members: {
						create: {
							user: { connect: { id: id } },
							role: "AUTHOR",
						},
					},
        },
      });
    }),
	addmember: adminProcedure
		.input(
			z.object({
				userId: z.string().min(1),
				courseId: z.number(),
				role: z.enum(["ADMIN", "AUTHOR", "TEACHER", "OBSERVATOR", "STUDENT"]),
			}),
		)
		.mutation(({ ctx, input }) => {
			return ctx.lms.memberInCourse.create({
        data: {
          course: { connect: { id: input.courseId } },
					user: { connect: { id: input.userId } },
          role: input.role,
        },
      });
    }),
	removemember: adminProcedure
		.input(
			z.object({
				userId: z.string().min(1),
				courseId: z.number(),
			}),
		)
		.mutation(({ ctx, input }) => {
			return ctx.lms.memberInCourse.delete({
				where: {
					userId_courseId: {
						userId: input.userId,
            courseId: input.courseId,
					},
				},
      });
    }),
  publish: adminProcedure.input(z.number()).mutation(({ ctx, input }) => {
    return ctx.lms.course.update({
      where: { id: input },
      data: { published: true },
    });
  }),
  unpublish: adminProcedure.input(z.number()).mutation(({ ctx, input }) => {
    return ctx.lms.course.update({
      where: { id: input },
      data: { published: false },
    });
  }),
  delete: adminProcedure.input(z.number()).mutation(({ ctx, input }) => {
    return ctx.lms.course.update({
      where: { id: input },
      data: {
        deleted: true,
        modules: {
          updateMany: {
            where: {
              deleted: false,
            },
            data: {
              deleted: true,
            },
          },
        },
        lessons: {
          updateMany: {
            where: {
              deleted: false,
            },
            data: {
              deleted: true,
            },
          },
        },
      },
    });
  }),
	undelete: adminProcedure.input(z.number()).mutation(({ ctx, input }) => {
    return ctx.lms.course.update({
      where: { id: input },
      data: {
        deleted: false,
        modules: {
          updateMany: {
            where: {
              deleted: true,
            },
            data: {
              deleted: false,
            },
          },
        },
        lessons: {
          updateMany: {
            where: {
              deleted: true,
            },
            data: {
              deleted: false,
            },
          },
        },
      },
    });
  }),
});
