const warehouseService = require("../services/warehouse.service");

async function listWarehouses(req, res, next) {
  try {
    const warehouses = await warehouseService.getAllWarehouses();
    res.json(warehouses);
  } catch (error) {
    next(error);
  }
}

async function addWarehouse(req, res, next) {
  try {
    const { name, address, lat, lng, maxCapacity } = req.body;
    if (!name || lat == null || lng == null) {
      return res.status(400).json({ error: "name, lat, and lng are required" });
    }

    const warehouse = await warehouseService.createWarehouse({
      name,
      address,
      lat,
      lng,
      maxCapacity,
    });

    res.status(201).json(warehouse);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listWarehouses,
  addWarehouse,
};
