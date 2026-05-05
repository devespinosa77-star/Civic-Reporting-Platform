const express = require('express');

const path = require('path');

const db = require('./queries');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Host react app as static files
app.use(express.static(path.resolve(__dirname, '../client/build')))

const PORT = 8000 

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
}) 

app.get('/users', db.getUsers);
app.post('/new', db.createUser);

// Starting Express on our PORT
app.listen(PORT, () => {
    console.log(`The app is running on port ${PORT}.`)
})
