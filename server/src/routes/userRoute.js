import express from "express";
import { loginUser, logoutUser, registerUser, updateUserDetails, uploadAvatar, verifyEmail } from "../controllers/userController.js";
import verifyToken from "../middleware/verifyToken.js";
import upload from "../middleware/multer.js";


const router = express();

router.post('/register', registerUser);
router.put('/verify-email', verifyEmail);
router.post('/login', loginUser);
router.post('/logout', verifyToken, logoutUser);
router.put('/upload-avatar', verifyToken, upload.single('avatar'), uploadAvatar);
router.put('/update-user-details', verifyToken, updateUserDetails);

export default router;