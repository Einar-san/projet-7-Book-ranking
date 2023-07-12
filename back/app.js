const express = require('express')
const mongoose = require('mongoose')
const argon2 = require('argon2')
const authRoutes = require('./routes/auth');
const app = express()
const port = 3000


//MongoDB connection
mongoose.connect('mongodb+srv://sena21ouarem:myoldgrim@clustertest0.ff8vuc2.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use(express.json());

app.get('/api/books', (req, res) => {
    res.send('All books!')
})

app.get('/api/books/:id', (req, res) => {
    res.send('This book')
})

app.get('/api/books/bestrating', (req, res) => {
    res.send('Best books')
})

app.use('/api/auth', authRoutes);



app.post('/api/auth/login', (req, res) => {
    res.send('Welcome back')
})

app.post('/api/books', (req, res) => {
    res.send('New book')
})


app.post('/api/books/:id/rating', (req, res) => {
    res.send('Book rating')
})

app.put('/api/books/:id', (req, res) => {
    res.send('Update book')
})

app.delete('/api/books/:id', (req, res)=> {
    res.send('Book deleted !')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})