const { DataTypes } = require("sequelize");
const { Sequelize } = require("../config/dbConfig");

const borrowedBook = Sequelize.define(
  "borrowedBook",
  {
    borrowed_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    borrowDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    returnDate: {
      type: DataTypes.DATE,
    },
  },
  {
    timeStamp: true,
    tableName: "borrowedBook",
  }
);
module.exports = borrowedBook;
