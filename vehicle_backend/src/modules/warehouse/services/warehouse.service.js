const { Warehouse } = require("../../../core/models");

async function getAllWarehouses() {
  return Warehouse.findAll({ order: [["id", "ASC"]] });
}

async function createWarehouse({ name, address, lat, lng, maxCapacity }) {
  return Warehouse.create({
    name,
    address,
    latitude: lat,
    longitude: lng,
    maxCapacity: maxCapacity || null,
  });
}

module.exports = {
  getAllWarehouses,
  createWarehouse,
};
