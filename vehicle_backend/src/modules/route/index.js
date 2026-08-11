const routeController = require("./controllers/route.controller");
const routeService = require("./services/route.service");
const routeRoutes = require("./routes/route.routes");
const routeMiddleware = require("./middleware/route.middleware");
const routeValidation = require("./validations/route.validation");
const routeModel = require("./models/route.model");

module.exports = {
  routeController,
  routeService,
  routeRoutes,
  routeMiddleware,
  routeValidation,
  routeModel,
};
