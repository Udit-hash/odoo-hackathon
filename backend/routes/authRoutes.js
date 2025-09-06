import express from 'express';
import {
  signupUser,
  signinUser,
  getLoggedInUserProfile,

} from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/signup', signupUser);

// @desc    Authenticate (sign in) a user and get a token
// @route   POST /api/users/signin
// @access  Public
router.post('/signin', signinUser);


// ====================================================================
// ## PRIVATE ROUTES (Login required) ##
// ====================================================================

// @desc    Get the profile of the currently logged-in user
// @route   GET /api/users/me
// @access  Private
router.get('/me', authMiddleware, getLoggedInUserProfile);




export default router;