const sharp = require('sharp');
const path = require('path');
const Book = require('../models/books');

// Controller for adding a new book
const addBook = async (req, res) => {
    try {
        const { book } = req.body;
        const { userId, title, author, year, genre, ratings } = JSON.parse(book);

        // Resize the uploaded image to a width of 460 pixels
        const imageBuffer = req.file.buffer; // Access the uploaded image as a buffer

        // Resize the uploaded image to a width of 460 pixels
        const resizedImageBuffer = await sharp(imageBuffer)
            .resize(460, 600, { fit: 'cover', position: 'center' })
            .extend({ background: { r: 255, g: 255, b: 255, alpha: 1 }, top: 0, bottom: 0 })
            .toBuffer();
        // Generate a unique filename for the resized image
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const resizedImageFilename = `${uniqueSuffix}.jpg`;

        // Define the path to store the resized image
        const resizedImagePath = path.join(__dirname, '../bookCollection', resizedImageFilename);

        // Image url
        const imageUrl = `http://localhost:4000/bookCollection/${resizedImageFilename}`
        // Save the resized image to the specified path
        await sharp(resizedImageBuffer).toFile(resizedImagePath);

        // Create a new book document
        const newBook = new Book({
            userId,
            title,
            author,
            imageUrl,
            year,
            genre,
            ratings
        });

        // Save the book to the database
        const savedBook = await newBook.save();

        res.status(201).json({ message: 'Book successfully saved'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
};
const getAllBooks = async (req, res) => {
    try {
        // Fetch all books from the database
        const books = await Book.find();

        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching books' });
    }
}
module.exports = { addBook , getAllBooks};