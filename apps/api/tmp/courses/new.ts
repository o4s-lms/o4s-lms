import slugify from '@sindresorhus/slugify';
import { createOperation, z } from '../../generated/wundergraph.factory';

export default createOperation.mutation({
  input: z.object({
    name: z.string(),
		description: z.string(),
    image: z.string(),
  }),
  handler: async ({ operations, input, user }) => {
		const userId = String(user?.userId);
    const course = await operations.mutate({
      operationName: 'courses/create',
      input: {
        name: input.name,
				description: input.description,
				slug: slugify(input.name),
        image: input.image,
				userId,
      },
    });
    if (!course) {
      throw new Error('Error creating the course');
    }
    const member = await operations.mutate({
      operationName: 'courses/addmember',
      input: {
        userId,
				courseId: course.data.createOneCourse.id,
				role: 'AUTHOR',
      },
    });
    const out: {
      name: string;
      description: string;
      weather: {
        title: string;
        description: string;
      };
    } = {
      country: country.data?.countries_countries[0].name || '',
      capital: country.data?.countries_countries[0].capital || '',
      weather: {
        title: weather.data?.weather_getCityByName?.weather?.summary?.title || '',
        description: weather.data?.weather_getCityByName?.weather?.summary?.description || '',
      },
    };
    return out;
  },
});