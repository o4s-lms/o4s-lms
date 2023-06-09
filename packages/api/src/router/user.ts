import { z } from "zod";

import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  all: adminProcedure
    .input(
      z.object({
        skip: z.number().optional(),
        take: z.number().optional(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.lms.user.findMany({
        orderBy: { id: "desc" },
        skip: input.skip,
        take: input.take,
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          courses: {
            select: {
              courseId: true,
              role: true,
              course: {
                select: {
                  name: true,
									image: true,
                },
              },
            },
          },
        },
      });
    }),
  byUserRole: adminProcedure
    .input(
      z.object({
        skip: z.number().optional(),
        take: z.number().optional(),
        role: z.enum(["ADMIN", "AUTHOR", "TEACHER", "OBSERVATOR", "STUDENT"]),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.lms.memberInCourse.findMany({
        where: { role: input.role },
        distinct: ["userId"],
        select: {
          role: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              emailVerified: true,
              image: true,
              roles: true,
							courses: {
								select: {
									courseId: true,
									role: true,
									course: {
										select: {
											name: true,
											image: true,
										},
									},
								},
							},
            },
          },
        },
        skip: input.skip,
        take: input.take,
      });
    }),
  memberOf: protectedProcedure.query(({ ctx }) => {
    return ctx.lms.memberInCourse.findMany({
      where: { userId: ctx.session.user.id },
      select: {
        role: true,
        course: {
          // where: { deleted: false },
          select: {
            id: true,
            name: true,
            description: true,
            image: true,
          },
        },
      },
    });
  }),
  addToCourse: protectedProcedure
    .input(
      z.object({
        courseId: z.number(),
        userId: z.string().min(1),
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
});
