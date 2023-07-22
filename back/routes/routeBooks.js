const express = require('express');
const bookController = require('../controllers/bookController');
const upload = require('../middlewares/imagesUpload');
const verifyToken = require('../middlewares/verifyToken');




const router = express.Router();

// Add a new book
router.post('', verifyToken, upload.single('image'), bookController.addBook);

// Get all books
router.get('', bookController.getAllBooks);

// Get best rated books
router.get('/bestrating', bookController.bestRating)
// Get one book by id
router.get('/:id', bookController.getBookById)

// Rate a book
router.post('/:id/rating', verifyToken, bookController.bookRating)

// Update a book
router.put('/:id', verifyToken, upload.single('image'), bookController.updateBook)

// Delete a Book
router.delete('/:id', verifyToken, bookController.deleteBook)


module.exports = router;