const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const Users = require('./users');
const Books = require('./books');

const borrowedBooks = sequelize.define(
  "borrowedBooks",
  {
    borrowed_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Users,
        key: 'user_id', 
      },
      onDelete: 'CASCADE',
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Books,
        key: 'book_id', 
      },
      onDelete: 'CASCADE',
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
    tableName: "borrowedBooks",
  }
);
module.exports = borrowedBooks;
