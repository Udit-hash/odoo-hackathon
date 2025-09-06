const jwt = require("jsonwebtoken");

// ⚠ For testing only. In a real app, this MUST be in a .env file.
const JWT_SECRET = "mysecretpassword"; 

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        // Use 401 Unauthorized for token errors.
        return res.status(401).json({
            message: "Authentication failed: No token provided."
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // This is the key change: Attach the email from the token to the request.
        req.email = decoded.email;
        
        // If successful, proceed to the controller.
        next();

    } catch (error) {
        // Any error during token verification will be caught here.
        return res.status(401).json({
            message: "Authentication failed: Invalid token."
        });
    }
};

module.exports = {
    authMiddleware
};