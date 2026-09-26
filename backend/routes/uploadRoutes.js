const express = require('express');
const { uploadImage } = require('../controllers/uploadController');
const { verifyToken, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/image', verifyToken, requireRole('instructor', 'admin'), upload.single('image'), uploadImage);

module.exports = router;
