import { z } from "zod";

import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";

export const productRouter = createTRPCRouter({
  all: publicProcedure
		.query(({ ctx }) => {
			return ctx.lms.product.findMany({
				orderBy: { id: "desc" },
				select: {
					id: true,
          name: true,
          description: true,
					image: true,
          price: true,
          currency: true,
					active: true,
					_count: {
						select: {
              courses: true,
							payments: true,
            },
					},
				},
			});
  }),
  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.lms.product.findFirst({
				where: { id: input.id },
				select: {
					id: true,
          name: true,
          description: true,
					image: true,
          price: true,
          currency: true,
					active: true,
					courses: {
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
	addCourse: adminProcedure
		.input(
			z.object({
				productId: z.number(),
				courseId: z.number(),
			}),
		)
		.mutation(({ ctx, input }) => {
			return ctx.lms.product.update({
				where: { id: input.productId },
        data: {
          courses: { connect: { id: input.courseId } },
        },
      });
    }),
	removeCourse: adminProcedure
		.input(
			z.object({
				productId: z.number(),
				courseId: z.number(),
			}),
		)
		.mutation(({ ctx, input }) => {
			return ctx.lms.product.update({
				where: { id: input.productId },
        data: {
          courses: { disconnect: { id: input.courseId } },
        },
      });
    }),
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.lms.product.create({ data: input });
    }),
  delete: adminProcedure.input(z.number()).mutation(({ ctx, input }) => {
    return ctx.lms.product.delete({ where: { id: input } });
  }),
});
