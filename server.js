const express = require('express');
require('dotenv').config();
const sequelize = require('./config/dbConfig');


const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000


sequelize.sync()
.then(()=>{
    console.log("Database connected successfully!");
    app.listen(PORT, (req, res) =>{
        console.log(`Server running on port ${PORT}`);
    })
})
.catch((err)=>{
    console.error('Unable to connect to the database:', err);
})

