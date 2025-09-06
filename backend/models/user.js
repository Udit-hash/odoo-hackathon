const pool = require('../db/db.js');

const UserModel = {
    /**
     * Creates a new user in the database.
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

    
    //   Finds a single user by their email address for the sign-in process.
    
    async findByEmail(email) {
        const query = "SELECT * FROM users WHERE email = $1";
        const result = await pool.query(query, [email]);
        return result.rows[0];
    },

    
    //  Finds a single user's profile by their email address.

    async findByEmailForProfile(email) {
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