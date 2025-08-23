import { z } from 'zod';

const querySchema = z
  .object({
    city: z.string().nullable().optional(),
    campus: z.string().nullable().optional(),
  })
  .strict()
  .refine(
    data =>
      (!data.city && !data.campus)
      || (typeof data.city === 'string' && typeof data.campus === 'string'),
    {
      message:
        'Either both city and campus should be null/undefined or both must have a value',
    },
  );

export default defineEventHandler(async (event) => {
  // Get query parameters
  const query = await getValidatedQuery(event, querySchema.parse);

  const restaurants = await getMenus(query || {});

  if (restaurants.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No restaurants found with the given parameters',
    });
  }

  return restaurants as Restaurant[];
});
