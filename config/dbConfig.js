const { Sequelize } = require('sequelize');
require("dotenv").config();

// database connection
const sequelize  = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mysql",
        logging: false,
        pool: {
            max: 5,
            min: 1,
            acquire: 30000,
            idle: 1000,
        },
        timezone: '+05:30'  
    }
);

module.exports = sequelize;