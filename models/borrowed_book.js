const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const borrowedBook = sequelize.define(
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
    status: { 
      type: DataTypes.ENUM,
      values: ['borrowed', 'returned'],
      defaultValue: 'borrowed'
    }
  },
  {
    timestamps: true,
    tableName: "borrowedBook",
  }
);
module.exports = borrowedBook;
