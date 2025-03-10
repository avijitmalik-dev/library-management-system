const express = require('express');
const isAuthenticated = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const { borrowBook, returnBook, recordTransaction, getMemberRecords, getBookRecord } = require('../controllers/borrowBookController');
const router = express.Router();


router.post('/borrow', isAuthenticated, checkRole(['Member']), borrowBook);
router.post('/return', isAuthenticated, checkRole(['Member']), returnBook);
router.post('/record-transaction', isAuthenticated, checkRole(['Librarian']), recordTransaction);
router.get('/getMemberRecords', isAuthenticated, checkRole(['Member']), getMemberRecords);
router.get('/getBookRecord/:bookId', isAuthenticated, checkRole(['Librarian']), getBookRecord);

module.exports = router;