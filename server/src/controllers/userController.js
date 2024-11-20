import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { sendPasswordResetEmail, sendResetPasswordLink, sendVerificationEmail } from '../utils/emailer.js';
import { generateAccessToken, generateRefreshToken, generateToken, isTokenExpired } from '../utils/token.js';
import uploadImageCloudinary from '../utils/uploadImage.js';


export const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(302).json({
                status: 302,
                success: false,
                message: "User already exists",
            });
        }

        const hashPassword = await bcrypt.hash(password, 12);

        const newCreatedUser = await User.create({
            name,
            email,
            password: hashPassword
        });


        await sendVerificationEmail(email, newCreatedUser?._id);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Account created successfully, please verify your email",
            result: {
                userId: newCreatedUser._id,
                name,
                email
            },
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to create account",
            error: error,
        });
    }
};

export const verifyEmail = async (req, res) => {
    try {

        const { code } = req.body;

        const user = await User.findOne({ _id: code });

        if (!user) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "User not found",
            });
        }

        user.verify_email = true;
        await user.save();

        res.status(200).json({
            status: 200,
            success: true,
            message: "Email verified successfully",
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to verify email",
            error: error,
        });
    }
};

export const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Invalid email or password",
            });
        }

        if (user.status !== "Active") {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "User is not active, please contact admin"
            });
        }

        if (!user.verify_email) {
            await sendVerificationEmail(email, user?._id);
            return res.status(401).json({
                status: 401,
                success: false,
                message: "Please verify your email and login again, please check your email for verification link",
            });
        };

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                status: 401,
                success: false,
                message: "Check your password",
            });
        }

        const accessToken = await generateAccessToken(user);
        const refreshToken = await generateRefreshToken(user);

        // const cookieOptions = {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     sameSite: 'strict',
        //     maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days in milliseconds
        // };

        // Set cookies with appropriate security options
        res.cookie('accessToken', accessToken, {
            httpOnly: true, // Prevents JavaScript access to the cookie
            secure: process.env.NODE_ENV === 'production', // Only sends cookie over HTTPS in production
            sameSite: 'strict', // Protects against CSRF
            maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days in milliseconds
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        });

        res.status(200).json({
            status: 200,
            success: true,
            message: "Login successful",
            result: {
                userId: user._id,
                userEmail: user.email,
                accessToken,
                refreshToken
            },
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "failed to login",
            error: error,
        });
    }
};


export const logoutUser = async (req, res) => {
    try {

        const userId = req.user.userId;

        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        await User.findByIdAndUpdate({ _id: userId }, { refresh_token: "" });

        res.status(200).json({
            status: 200,
            success: true,
            message: "Logout successful",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to logout",
            error: error,
        });
    }
};


export const uploadAvatar = async (req, res) => {

    try {

        const userId = req.user.userId;

        const image = req.file;

        const uploadImage = await uploadImageCloudinary(image);

        await User.findByIdAndUpdate({ _id: userId }, { avatar: uploadImage?.url });

        return res.status(200).json({
            status: 200,
            success: true,
            message: "Profile Photo uploaded successfully",
            result: {
                userId: userId,
                avatar: uploadImage?.url
            },
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to upload avatar",
            error: error,
        });
    }
};


export const updateUserDetails = async (req, res) => {

    try {

        const userId = req.user.userId;

        const { name, mobile } = req.body;

        const updateUser = await User.findByIdAndUpdate({ _id: userId }, { name, mobile }, { new: true }).select('-password -refresh_token -verify_email -reset_password_token -reset_password_token_expires_at');

        if (!updateUser) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "User not found",
            });
        };

        res.status(200).json({
            status: 200,
            success: true,
            message: "User details updated successfully",
            result: updateUser
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to update user details",
            error: error,
        });
    }

};


export const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "User not found"
            });
        };

        const token = generateToken();

        const expiredAt = new Date(Date.now() + 3600);

        await User.findByIdAndUpdate(user._id, {
            reset_password_token: token,
            reset_password_token_expires_at: expiredAt
        })

        await sendResetPasswordLink(email, token);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Password reset link sent successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to send email",
            error: error,
        });
    }
};


export const resetPassword = async (req, res) => {
    try {

        const { token, password } = req.body;

        const user = await User.findOne({ reset_password_token: token });

        if (!user || isTokenExpired(user.reset_token_expires_at)) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Your session has expired. Please close this page and try again to reset your password."
            });
        };

        const hashedPassword = await bcrypt.hash(password, 12);

        await User.findByIdAndUpdate(user._id, {
            password: hashedPassword,
            reset_password_token: null,
            reset_password_token_expires_at: null
        });

        await sendPasswordResetEmail(user.email);

        res.status(200).json({
            status: 200,
            success: true,
            message: "Password reset successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Failed to reset password",
        });
    }
};



export const refreshAccessToken = async (req, res) => {
    try {
  
      const { refreshToken } = req.cookies;
  
      if (!refreshToken) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Refresh token not found",
        });
      }
  
      // Verify the refresh token
      jwt.verify(refreshToken, process.env.JWT_REFRESH, async (err, decoded) => {
        if (err) {
          return res.status(403).json({
            status: 403,
            success: false,
            message: "Invalid or expired refresh token",
          });
        }
  
        // If the refresh token is valid, extract user info from the decoded payload
        const user = {
          _id: decoded.userId,
          email: decoded.email,
          role: decoded.role
        };
  
        // Generate a new access token and a new refresh token
        const newAccessToken = await generateAccessToken(user);
        const newRefreshToken = await generateRefreshToken(user);
  
        res.cookie('accessToken', newAccessToken, {
          httpOnly: true, // Prevents JavaScript access to the cookie
          secure: process.env.NODE_ENV === 'production', // Only sends cookie over HTTPS in production
          sameSite: 'strict', // Protects against CSRF
          maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
        });
  
        res.cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        });
  
        // Return the new tokens in the response
        res.status(200).json({
          status: 200,
          success: true,
          message: "Access token refreshed successfully",
          result: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
          }
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: 500,
        success: false,
        message: "Failed to refresh access token",
      });
    }
  };


