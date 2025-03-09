const express = require("express");
const isAuthenticated = require("../middleware/authMiddleware");
const { createBook } = require("../controllers/bookController");
const checkRole = require('../middleware/roleMiddleware');
const router = express.Router();

router.post('/create-book', isAuthenticated, checkRole(['Admin']), createBook);


module.exports = router;