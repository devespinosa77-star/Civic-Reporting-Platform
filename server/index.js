const express = require('express');

const app = express();

const path = require('path');

const db = require('./queries');

const PORT = 9002

// Middleware
app.use(express.static(path.resolve(__dirname, '../client/build')))

// Routes
app.get('/', (req, res) => {
    // We'll do some stuff here
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
})

// CRUD
// CREATE: add data to the database
// READ: get data from the database
app.get('/users', db.getUsers);
// UPDATE: update data in the database 
// DELETE: delete data from the database


// Starting Express on our PORT
app.listen(PORT, () => {
    console.log(`The app is running on port ${PORT}.`)
})
