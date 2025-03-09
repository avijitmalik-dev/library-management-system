const { DataTypes } = require("sequelize");
const { Sequelize } = require("../config/dbConfig");
const role = require("./role");

const user = Sequelize.define(
  "user",
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(2055),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
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
    timeStamp: true,
    tableName: "user",
  }
);

module.exports = user;
