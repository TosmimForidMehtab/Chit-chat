const express = require( "express" );
const { registerUser, authUser, allUsers, changePassword, sendOtp, generateOTP } = require( "../controllers/userControllers" );
const { protect } = require( "../middleware/authMiddleware" );

const router = express.Router();

router.route( "/" ).get( protect, allUsers );
router.route( "/" ).post( registerUser );
router.post( "/login", authUser );
router.post( "/generate", generateOTP );
router.post( "/sendotp", sendOtp );
router.post( "/changepassword", changePassword );

module.exports = router;
