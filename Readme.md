# Getting started with "Mon vieux grimoire" local environnement setup

The project is build with a react client application, an express server side application and mongodb database

## Routes :

The express server features five public routes:

### `POST : "/auth/signup" : (User account creation)`
### `POST :"/auth/login" : (User account connexion)`
### `GET :"/api/books" : (return all books)`
### `GET :"/api/books/:id" : (Dynamic route)`
### `GET :"/api/books/bestrating" (return the three highest rated books)`

And four authenticated routes : 

### `POST : "/api/books" : (Create a new book)`
### `PUT :"/api/books/:id" : (Update an existing book)`
### `DELETE :"/api/books/:id" : (delete a book)`
### `GET :"/api/books/:id/rating" : (rate a book)`

The frontend application (react) and the backend application (express) run on different ports

react on : localhost:3000
express on : localhost:4000

We used the Cors library on the express server to provide the communication between the two ports



### `express setup : `

**Run : ``npm install`` in "back" directory to install all dependencies**

**Run : ``node app.js`` in "back" directory to run the server**

### `React setup : `

**Run : ``npm install`` in "front" directory to install all dependencies**

**Run : ``npm start`` in "front" directory to run react application**



