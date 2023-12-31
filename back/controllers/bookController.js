const path = require('path');
const Book = require('../models/books');
const fs = require("fs");
const resizeSave = require("../helpers/resizeSave");
const { validationResult } = require('express-validator');
const { check } = require('express-validator');

// Controller for all book routes


// Validation rules
const addBookValidationRules = [
    check('book').notEmpty().withMessage('Book data is required').isJSON().withMessage('Book data must be a valid JSON object'),
    check('userId').notEmpty().withMessage('userId is required').isString().withMessage('userId must be a string'),
    check('title').notEmpty().withMessage('Title is required').isString().withMessage('Title must be a string'),
    check('author').notEmpty().withMessage('Author is required').isString().withMessage('Author must be a string'),
    check('year').notEmpty().withMessage('Year is required').isNumeric().withMessage('Year must be a number'),
    check('genre').notEmpty().withMessage('Genre is required').isString().withMessage('Genre must be a string'),
    check('ratings').optional().isArray().withMessage('Ratings must be an array'),
    check('averageRating').optional().isNumeric().withMessage('Average rating must be a number'),
];
const addBook = async (req, res) => {

    // Trigger data validation
    const errors = validationResult(req);
    console.log(errors)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors });
    }
    try {

        const { book } = req.body;
        const { userId, title, author, year, genre, ratings, averageRating } = JSON.parse(book);

        // Resize the uploaded image to a width of 460 pixels
        const imageBuffer = req.file.buffer; // Access the uploaded image as a buffer
        const imageUrl = await resizeSave(imageBuffer); // Resize and save the file, then return the image URL

        // Create a new book document
        const newBook = new Book({
            userId,
            title,
            author,
            imageUrl,
            year,
            genre,
            ratings,
            averageRating
        });

        // Save the book to the database
        await newBook.save();

        res.status(201).json({ message: 'Book successfully saved' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};
// Get all books
const getAllBooks = async (req, res) => {
    try {
        // Fetch all books from the database
        const books = await Book.find();

        res.json(books);
    } catch (error) {
        res.status(500).json({ error });
    }
}

// Get a book by id
const getBookById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the book by ID in the database
        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.json(book);
    } catch (error) {
        res.status(500).json({ error});
    }
}

// Book rating
const bookRating = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, rating } = req.body;

        // Find the book by ID in the database
        const book = await Book.findById(id);

        if (!book) {
            const notFoundError = new Error('Book not found');
            notFoundError.statusCode = 404;
            throw notFoundError;
        }

        // Check if the user has already rated the book
        const existingRating = book.ratings.find((rating) => rating.userId === userId);
        if (existingRating) {
            const alreadyRatedError = new Error('User has already rated this book');
            alreadyRatedError.statusCode = 400;
            throw alreadyRatedError;
        }


        // Add the new rating to the array of ratings for the book
        book.ratings.push({ userId, grade: rating });

        // Calculate the new average rating
        const totalRatings = book.ratings.length;
        const sumRatings = book.ratings.reduce((total, currentRating) => total + currentRating.grade, 0);
        // Update the average rating in the book document
        book.averageRating = Math.round((sumRatings / totalRatings) * 10) / 10;

        // Save the updated book in the database
        await book.save();

        res.json(book);
    } catch (error) {
        if (error.statusCode) {
            // If custom error with status code, send the specific error message and status code
            res.status(error.statusCode).json({ error });
        } else {
            // For other errors, set status code to 500 and send the error
            res.status(500).json({ error });
        }
    }
}

// Get best rated books
const bestRating = async (req, res) => {
    try {
        // Fetch the three best average-rated books from the database
        const books = await Book.find().sort({ averageRating: -1 }).limit(3);
        res.json(books);
    } catch (error) {
        res.status(500).json({ error });
    }
}

// Update a book
const updateBook = async (req, res) => {
    try {

        const { id } = req.params;
        let parsedBookData
        if (req.body.book) {
            parsedBookData = await JSON.parse(req.body.book);// Parse the string into an object
        }

        else {
            parsedBookData = req.body
        }

        // Find the book by ID in the database
        const book = await Book.findById(id);

        if (!book) {
            const notFoundError = new Error('Book not found');
            notFoundError.statusCode = 404;
            throw notFoundError;
        }

        // Check if the user is the owner of the book
        if (book.userId.toString() !== parsedBookData.userId) {
            const notAuthorizedError = new Error('You are not authorized to update this book');
            notAuthorizedError.statusCode = 403;
            throw notAuthorizedError;
        }

        // Check if the request contains a file
        if (req.file) {
            // Remove the previous image file

            if (book.imageUrl) {
                try {

                    const fileName = book.imageUrl.split('/').pop(); // Extract the file name from the URL
                    const filePath = path.resolve(__dirname, '..', 'bookCollection', fileName);
                    fs.unlinkSync(filePath);

                } catch (e) {
                    console.log(e.message)
                }
            }

            // Resize the uploaded image to a width of 460 pixels
            const imageBuffer = req.file.buffer; // Access the uploaded image as a buffer

            book.imageUrl = await resizeSave(imageBuffer) // resize and save the file then return the image url
        }

        // Update other information with the request body data

        book.title = parsedBookData.title || book.title; // the operator || is used for assigning default or fallback values
        book.author = parsedBookData.author || book.author;
        book.year = parsedBookData.year || book.year;
        book.genre = parsedBookData.genre || book.genre;
        // Save the updated book in the database
        await book.save();

        res.json({ message: 'Book updated successfully' });
    } catch (error) {
        if (error.statusCode) {
            // If custom error with status code, send the specific error message and status code
            res.status(error.statusCode).json({ error});
        } else {
            // For other errors, set status code to 500 and send the error
            res.status(500).json({ error });
        }
    }
}

// Delete a Book
const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the book by ID in the database
        const book = await Book.findById(id);

        // Check if the book exists
        if (!book) {
            const notFoundError = new Error('Book not found');
            notFoundError.statusCode = 404;
            throw notFoundError;
        }

        // Check if the user is the owner of the book
        if (book.userId.toString() !== req.userId) {
            const notAuthorizedError = new Error('You are not authorized to delete this book');
            notAuthorizedError.statusCode = 403;
            throw notAuthorizedError;
        }

        // Remove the image file if it exists
        if (book.imageUrl) {
            const fileName = book.imageUrl.split('/').pop(); // Extract the file name from the URL
            const filePath = path.resolve(__dirname, '..', 'bookCollection', fileName);
            fs.unlinkSync(filePath);
        }

        // Delete the book from the database
        await Book.findByIdAndDelete(id);

        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        if (error.statusCode) {
            // If custom error with status code, send the specific error message and status code
            res.status(error.statusCode).json({ error});
        } else {
            // For other errors, set status code to 500 and send the error
            res.status(500).json({ error });
        }
    }
}


module.exports = { addBook , getAllBooks, getBookById, bookRating, bestRating, updateBook, deleteBook};