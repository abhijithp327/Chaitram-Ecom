import express from "express";
import { forgotPassword, loginUser, logoutUser, refreshAccessToken, registerUser, resetPassword, updateUserDetails, uploadAvatar, verifyEmail } from "../controllers/userController.js";
import verifyToken from "../middleware/verifyToken.js";
import upload from "../middleware/multer.js";


const router = express();

router.post('/register', registerUser);
router.put('/verify-email', verifyEmail);
router.post('/login', loginUser);
router.post('/logout', verifyToken, logoutUser);
router.put('/upload-avatar', verifyToken, upload.single('avatar'), uploadAvatar);
router.put('/update-user-details', verifyToken, updateUserDetails);
// forgot password
router.post('/forgot-password', forgotPassword);
// reset password
router.post('/reset-password', resetPassword);
// refresh token
router.post('/refresh-token', refreshAccessToken);

export default router;