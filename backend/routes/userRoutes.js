const express = require('express');
const { updateProfile, getAllUsers } = require('../controllers/userController');
const { verifyToken, requireRole } = require('../middleware/auth');

const router = express.Router();

router.put('/me', verifyToken, updateProfile);
router.get('/', verifyToken, requireRole('admin'), getAllUsers);

module.exports = router;
