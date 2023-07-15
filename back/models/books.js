const mongoose = require('mongoose')

const booksSchema = mongoose.Schema({
    userId: { type: 'String', require:true },
    title: { type: 'String', require: true},
    author: { type: 'String', require: true },
    imageUrl: { type: 'String', require: true},
    year: {type: 'Number', require: true},
    genre: { type: 'string', require: true},
    // Store user ratings
    ratings: [
        {
            userId: 'String',
            grade: 'Number'
        }
    ],
    // Global rating
    averageRating: { type: 'Number',default: 0},
    createdAt: { type: 'date', default: Date.now}
})

module.exports = mongoose.model('books', booksSchema);