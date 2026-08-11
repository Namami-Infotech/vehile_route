const express = require("express");
const routeController = require("../controllers/route.controller");
const {
  validateRoutePlan,
  loadWarehouses,
} = require("../middleware/route.middleware");

const router = express.Router();

// router.post(
//   "/plan",
//   validateRoutePlan,
//   loadWarehouses,
//   routeController.planRoute,
// );
router.get("/optimize", routeController.getShortestPath);

module.exports = router;
