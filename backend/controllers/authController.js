const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const UserModel = require('../models/user.js');
const { email } = require('zod/v4');


const JWT_SECRET = 'mysecretpassword'; 

//  SIGN UP A NEW USER ##
const signupUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "Please fill in all fields." });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Please enter a valid email address." });
        }

        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await UserModel.create({
            firstName,
            lastName,
            email,
            hashedPassword
        });

        res.status(201).json({ message: "User created successfully!", user: newUser });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// SIGN IN AN EXISTING USER ##
const signinUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password." });
        }

        const user = await UserModel.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        
        const payload = { email: user.email };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            message: "Signed in successfully!",
            token: token
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// GETS THE LOGGED-IN USER'S PROFILE 
const getLoggedInUserProfile = async (req, res) => {
    try {
       
        const userId = req.email;

        const userProfile = await UserModel.findById(email);

        if (!userProfile) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json(userProfile);

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


module.exports = {
    signupUser,
    signinUser,
    getLoggedInUserProfile
};
