const pool = require('../db/db.js'); // Your database connection pool

const UserModel = {
    /**
     * Creates a new user in the database.
     * @param {object} userData Contains firstName, lastName, email, and hashedPassword.
     * @returns {Promise<object>} The newly created user object, excluding the password hash.
     */
    async create(userData) {
        const { firstName, lastName, email, hashedPassword } = userData;
        const query = `
            INSERT INTO users (first_name, last_name, email, password_hash)
            VALUES ($1, $2, $3, $4)
            RETURNING user_id, first_name, last_name, email, created_at
        `;
        const result = await pool.query(query, [firstName, lastName, email, hashedPassword]);
        return result.rows[0];
    },

    /**
     * Finds a single user by their email address for the sign-in process.
     * This version includes the password hash for internal comparison.
     * @param {string} email The email to search for.
     * @returns {Promise<object|undefined>} The full user object or undefined if not found.
     */
    async findByEmail(email) {
        const query = "SELECT * FROM users WHERE email = $1";
        const result = await pool.query(query, [email]);
        return result.rows[0];
    },

    /**
     * Finds a single user's profile by their email address.
     * This version securely omits the password hash and is safe to send to the client.
     * @param {string} email The user's email address.
     * @returns {Promise<object|undefined>} The user's profile data or undefined if not found.
     */
    async findByEmailForProfile(email) {
        // IMPORTANT: We never return the password hash to the client.
        const query = `
            SELECT user_id, first_name, last_name, email, created_at 
            FROM users 
            WHERE email = $1
        `;
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }
};

module.exports = UserModel;