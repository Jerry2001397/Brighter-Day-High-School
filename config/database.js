const { Pool } = require('pg');
require('dotenv').config();

let pool = null;

if (process.env.DATABASE_URL) {
    console.log('DATABASE_URL is set: YES');

    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    pool.query('SELECT NOW()', (err) => {
        if (err) {
            console.error('Error connecting to database:', err.message);
            console.error('Please make sure database is running and credentials are correct');
        } else {
            console.log('✓ Database connected successfully');
        }
    });
} else {
    console.warn('DATABASE_URL is not set. Server will start, but database features are disabled.');
}

module.exports = {
    query: async (...args) => {
        if (!pool) {
            throw new Error('Database is not configured. Set DATABASE_URL environment variable.');
        }
        return pool.query(...args);
    }
};
