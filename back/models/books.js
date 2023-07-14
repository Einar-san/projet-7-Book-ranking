const mongoose = require('mongoose')

const booksSchema = mongoose.Schema({
    userId: { type: 'string', require:true },
    title: { type: 'string', require: true},
    author: { type: 'string', require: true },
    imageUrl: { type: 'string', require: true},
    year: {type: 'number', require: true},
    genre: { type: 'string', require: true},
    // Store user ratings
    ratings: [
        {
            userId: 'string',
            grade: 'number'
        }
    ],
    // Global rating
    averageRating: { type: 'number',default: 0},
    createdAt: { type: 'date', default: Date.now}
})

module.exports = mongoose.model('books', booksSchema);