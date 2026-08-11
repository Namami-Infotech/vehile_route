const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Warehouse = sequelize.define(
  "Warehouse",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    maxCapacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "warehouses",
    timestamps: true,
  },
);

module.exports = Warehouse;
