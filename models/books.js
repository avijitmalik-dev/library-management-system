const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const books = sequelize.define(
  "books",
  {
    book_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isbn: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    totalCopies: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    availableCopies: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    tabelName: "books",
  }
);
module.exports = books;
