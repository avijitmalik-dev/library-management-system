const express = require("express");
const isAuthenticated = require("../middleware/authMiddleware");
const { createBook, getBooks, updateBook, deleteBook, getBookById } = require("../controllers/bookController");
const checkRole = require('../middleware/roleMiddleware');
const router = express.Router();

router.post('/createBooks', isAuthenticated, checkRole(['Admin']), createBook);
router.get('/getBooks', isAuthenticated, checkRole(['Admin', 'Librarian','Member']), getBooks);
router.get('/getBooks/:bookId', isAuthenticated, isAuthenticated, checkRole(['Admin', 'Librarian','Member']), getBookById);
router.put('/updateBook/:id', isAuthenticated, checkRole(['Admin']), updateBook);
router.delete('/deleteBook/:id', isAuthenticated, checkRole(['Admin']), deleteBook);

module.exports = router;