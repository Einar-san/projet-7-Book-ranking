const mongoose = require('mongoose')

const booksSchema = mongoose.Schema({
    userId: { type: 'string', require:true },
    title: { type: 'string', require: true},
    author: { type: 'string', require: true },
    imageUrl: { type: 'string', require: true},
    genre: { type: 'number', require: true},
    // Stor user ratings
    ratings: [
        {
            userId: 'number',
            grade: 'number'
        }
    ],
    // Global rating
    averageRating: { type: 'number', require: true},
    createdAt: { type: 'date', default: Date.now}
})

module.exports = mongoose.model('books', booksSchema);