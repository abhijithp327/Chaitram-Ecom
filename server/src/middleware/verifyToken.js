import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const verifyToken = (req, res, next) => {

    // Check for the token in cookies
    const token = req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];

    if (!token) {
        res.status(401).json({ status: 401, auth: false, success: false, failed: true, message: "Authentication failed. Token not found" });
    } else {
        jwt.verify(token, process.env.JWT_ACCESS, (err, decoded) => {
            if (err) {
                res.status(401).json({ status: 401, auth: false, success: false, failed: true, message: "Invalid token" });
            } else {
                req.user = decoded;
                next();
            }
        });
    }

};

export default verifyToken;
