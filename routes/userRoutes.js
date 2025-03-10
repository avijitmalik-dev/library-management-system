const express = require('express');
const { getUser, getUnapprovedUser, approveUser, deleteUser, getUserRecord } = require('../controllers/userContoller');
const isAuthenticated = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const router = express.Router();



router.get('/getUser', isAuthenticated, checkRole(['Admin']), getUser);
router.get('/getUnapprovedUser', isAuthenticated, checkRole(['Admin']), getUnapprovedUser);
router.patch('/approveUser/:userId/:role', isAuthenticated, checkRole(['Admin']), approveUser);
router.delete('/deleteUser/:userId', isAuthenticated, checkRole(['Admin']), deleteUser);
router.get('/getUserRecord/:userId', isAuthenticated, checkRole(['Admin']), getUserRecord);





module.exports = router;
