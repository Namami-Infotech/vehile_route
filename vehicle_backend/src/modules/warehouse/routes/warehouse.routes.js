const express = require("express");
const warehouseController = require("../controllers/warehouse.controller");
const { validateWarehouse } = require("../middleware/warehouse.middleware");

const router = express.Router();

router.get("/", warehouseController.listWarehouses);
router.post("/", validateWarehouse, warehouseController.addWarehouse);

module.exports = router;
