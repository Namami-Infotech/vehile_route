const warehouseController = require("./controllers/warehouse.controller");
const warehouseService = require("./services/warehouse.service");
const warehouseRoutes = require("./routes/warehouse.routes");
const warehouseMiddleware = require("./middleware/warehouse.middleware");
const warehouseValidation = require("./validations/warehouse.validation");
const warehouseModel = require("./models/warehouse.model");

module.exports = {
  warehouseController,
  warehouseService,
  warehouseRoutes,
  warehouseMiddleware,
  warehouseValidation,
  warehouseModel,
};
