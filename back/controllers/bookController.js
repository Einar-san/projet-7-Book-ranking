const path = require('path');
const Book = require('../models/books');

const fs = require("fs");
const resizeSave = require("../helpers/resizeSave");

// Controller for adding a new book
const addBook = async (req, res) => {
    try {
        const { book } = req.body;
        const { userId, title, author, year, genre, ratings, averageRating } = JSON.parse(book);

        // Resize the uploaded image to a width of 460 pixels
        const imageBuffer = req.file.buffer; // Access the uploaded image as a buffer

        const imageUrl = await resizeSave(imageBuffer) // Resize and save the file, then return the image url

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

        res.status(201).json({ message: 'Book successfully saved'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
};

// Get all books
const getAllBooks = async (req, res) => {
    try {
        // Fetch all books from the database
        const books = await Book.find();

        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching books' });
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
        res.status(500).json({ error: 'An error occurred while fetching the book' });
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
            return res.status(404).json({ error: 'Book not found' });
        }

        // Check if the user has already rated the book
        const existingRating = book.ratings.find((rating) => rating.userId === userId);
        if (existingRating) {
            return res.status(400).json({ error: 'User has already rated this book' });
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
        res.status(500).json({ error: 'An error occurred while adding the rating' });
    }
}

// Get best rated books
const bestRating = async (req, res) => {
    try {
        // Fetch the three best average-rated books from the database
        const books = await Book.find().sort({ averageRating: -1 }).limit(3);
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the top-rated books' });
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
            return res.status(404).json({ error: 'Book not found' });
        }

        // Check if the user is the owner of the book
        if (book.userId.toString() !== parsedBookData.userId) {
            return res.status(403).json({ error: 'You are not authorized to update this book' });
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
        res.status(500).json({ error: 'An error occurred while updating the book' });
    }
}

// Delete a Book
const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the book by ID in the database
        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
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
        res.status(500).json({ error: 'An error occurred while deleting the book' });
    }
}


module.exports = { addBook , getAllBooks, getBookById, bookRating, bestRating, updateBook, deleteBook};