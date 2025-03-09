const { DataTypes } = require("sequelize");
const { Sequelize } = require("../config/dbConfig");

const book = Sequelize.afterDefine(
  "book",
  {
    book_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    isbn: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    availableCopies: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timeStamp: true,
    tabelName: "book",
  }
);
module.exports = book;
