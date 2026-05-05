// Connect to Postgres using the node-postgres package
const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'api',
    password: 'password',
    port: 5432,
})

// CREATE, READ, UPDATE, DELETE 
const createUser = (request, response) => {
    // Take the data the user passes us and insert it into our table
    const name = request.body.name;
    const URL = request.body.URL;

    pool.query('INSERT INTO users (name, URL) VALUES ($1, $2) RETURNING id', [name, URL], (error, results) => {
        if (error) {
            throw error;
        }
        const createdId = results.rows[0].id;
        response.status(201).send(`User added with ID: ${createdId}`);
    });
}

const getUsers = (request, response) => {
    // Get all the data currently in the database
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows);
    });
}

module.exports = {
    getUsers, 
    createUser 
}
