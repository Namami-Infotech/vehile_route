const { z } = require("zod");

const createRoutePlanSchema = z.object({
  source: z.object({
    lat: z.number({ required_error: "Source latitude is required" }),
    lng: z.number({ required_error: "Source longitude is required" }),
  }),
  maxDistanceKm: z.number().positive().default(100),
  useGoogleDistance: z.boolean().optional(),
});

module.exports = {
  createRoutePlanSchema,
};
