const { DataTypes } = require("sequelize");
const sequelize   = require("../config/dbConfig");

const user = sequelize.define(
  "user",
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    role: {
      type: DataTypes.ENUM("Admin", "Librarian", "Member", "Unverified"),
      defaultValue: "Unverified",
    },
  },
  {
    timestamps: true,
    tableName: "user",
  }
);

module.exports = user;
