const { DataTypes } = require("sequelize");
const { Sequelize } = require("../config/dbConfig");

const role = Sequelize.define(
  "role",
  {
    role_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    timeStamp: true,
    tableName: "role",
  }
);

module.exports = role;
