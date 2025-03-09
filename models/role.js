const { DataTypes } = require("sequelize");
const sequelize   = require("../config/dbConfig");

const role = sequelize.define(
  "role",
  {
    role_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "role",
  }
);

module.exports = role;
