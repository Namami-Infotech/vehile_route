const { createRoutePlanSchema } = require("../validations/route.validation");
const { Warehouse } = require("../../../core/models");

async function loadWarehouses(req, res, next) {
  try {
    req.warehouses = await Warehouse.findAll({ order: [["id", "ASC"]] });
    next();
  } catch (error) {
    next(error);
  }
}

function validateRoutePlan(req, res, next) {
  try {
    const parsed = createRoutePlanSchema.parse(req.body);
    req.body = parsed;
    next();
  } catch (error) {
    return res.status(400).json({
      error: error.errors
        ? error.errors.map((item) => item.message)
        : error.message,
    });
  }
}

module.exports = {
  loadWarehouses,
  validateRoutePlan,
};
