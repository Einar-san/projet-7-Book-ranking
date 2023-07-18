const dotenv = require('dotenv');
const path = require('path');
const express = require('express')
const mongoose = require('mongoose')
const authRoutes = require('./routes/auth');
const routeBooks = require('./routes/routeBooks')
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const app = express()
const port = 4000

dotenv.config({ path: path.resolve(__dirname, 'config', '.env') });


//MongoDB connection
mongoose.connect(process.env.MONGODB_URI,
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie'))
    .catch(() => console.log('Connexion à MongoDB échouée'));

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
}));

// JSON parsing

app.use(express.json());

// Add the express-mongo-sanitize middleware
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());



app.use('/bookCollection', express.static(path.join(__dirname, 'bookCollection')));

app.use('/api/auth', authRoutes);

app.use('/api/books', routeBooks)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})