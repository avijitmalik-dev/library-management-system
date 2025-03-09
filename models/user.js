const { DataTypes } = require("sequelize");
const sequelize   = require("../config/dbConfig");
const role = require("./role");

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
    role_id: {
      type: DataTypes.INTEGER,
      references: {
        model: role,
        key: "role_id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    is_approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    user_type: {
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
