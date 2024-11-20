import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/userModel.js";

export const generateAccessToken = async (user) => {

  const accessToken = await jwt.sign(
    {
      userId: user?._id,
      email: user?.email,
      role: user?.role,
    },
    process.env.JWT_ACCESS,
    { expiresIn: "10d" }
  );

  return accessToken;
};

export const generateRefreshToken = async (user) => {
  const refreshToken = jwt.sign(
    {
      userId: user?._id,
      email: user?.email,
      role: user?.role,
    },
    process.env.JWT_REFRESH,
    { expiresIn: "30d" }
  );

  await User.findOneAndUpdate(
    { _id: user._id },
    { refresh_token: refreshToken }
  );

  return refreshToken;

};


// Generate a unique reset token
export const generateToken = () => crypto.randomBytes(20).toString('hex');
// Function to check if a token is expired
export const isTokenExpired = (expiresAt) => new Date() > new Date(expiresAt);
