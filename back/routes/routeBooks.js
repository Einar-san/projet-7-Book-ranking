const express = require('express');
const bookController = require('../controllers/bookController');
const upload = require('../middlewares/imagesUpload');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

// Add a new book
router.post('', verifyToken, upload.single('image'), bookController.addBook);

router.get('', bookController.getAllBooks);

module.exports = router;