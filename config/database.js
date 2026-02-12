const { Pool } = require('pg');
require('dotenv').config();

// Create connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
        console.error('Please make sure database is running and credentials are correct');
    } else {
        console.log('✓ Database connected successfully');
    }
});

module.exports = pool;
