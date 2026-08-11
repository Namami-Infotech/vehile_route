const express = require("express");
const { warehouseRoutes, routeRoutes } = require("./modules");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

router.use("/warehouses", warehouseRoutes);
router.use("/route", routeRoutes);

module.exports = router;
