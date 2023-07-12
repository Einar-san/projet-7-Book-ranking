const mongoose = require('mongoose')

const usersSchema = mongoose.Schema({
    email: { type: 'string', require: true, unique: true},
    password: { type: 'string', require: true}
})

module.exports = mongoose.model('users', usersSchema);