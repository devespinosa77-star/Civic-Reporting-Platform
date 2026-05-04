// Connect to Postgres using the node-postgres package
const POOL = require('pg').Pool;

const pool = new POOL({
    user: 'me',
    host: 'localhost',
    database: 'api',
    password: 'password',
    port: 5432,
})

// Create all the functions that will be our request handlers in our Express server 

// Create a new user in the database

// Read all data from the database  
const getUsers = (req, res) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

// Update link in the database

// Delete link in the database

module.exports = {
    getUsers 
}