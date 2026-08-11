const {
  createWarehouseSchema,
} = require("../validations/warehouse.validation");

function validateWarehouse(req, res, next) {
  try {
    const parsed = createWarehouseSchema.parse(req.body);
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
  validateWarehouse,
};
