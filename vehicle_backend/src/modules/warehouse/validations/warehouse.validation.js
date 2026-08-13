const { z } = require("zod");

const createWarehouseSchema = z.object({
  name: z.string().min(1, "Warehouse name is required"),
  address: z.string().optional(),
  // lat: z.number({ required_error: "Latitude is required" }),
  // lng: z.number({ required_error: "Longitude is required" }),
  maxCapacity: z.number().int().positive().optional(),
});

module.exports = {
  createWarehouseSchema,
};
