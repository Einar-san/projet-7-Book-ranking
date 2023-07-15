const dotenv = require('dotenv');
const path = require('path');
const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./routes/auth');
const routeBooks = require('./routes/routeBooks')
const cors = require('cors');
const app = express()
const port = 4000

dotenv.config({ path: path.resolve(__dirname, 'config', '.env') });
//MongoDB connection
mongoose.connect('mongodb+srv://sena21ouarem:myoldgrim@clustertest0.ff8vuc2.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
}));

//JSON parsing
app.use(express.json());

app.use('/bookCollection', express.static(path.join(__dirname, 'bookCollection')));

app.use('/api/auth', authRoutes);

app.use('/api/books', routeBooks)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})