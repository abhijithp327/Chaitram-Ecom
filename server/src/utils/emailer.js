import { sendMail } from "../helper/nodeMailConfig.js";
import dotenv from "dotenv";


dotenv.config();

// send email verification 
export const sendVerificationEmail = async (usr_email, code) => {

    const verifyEmailLink = `${process.env.BASE_URL}/verify-email?code=${code}`;

    const emailData = {
        from: process.env.FROM_GMAIL,
        email: usr_email,
        subject: 'Green Leaf Email Verification',
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .container {
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    background-color: #f9f9f9;
                }
                .header {
                    background-color: #336d24;
                    color: #fff;
                    padding: 10px;
                    text-align: center;
                    border-radius: 5px 5px 0 0;
                }
                .content {
                    padding: 20px;
                    text-align: center;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    margin-top: 20px;
                    font-size: 16px;
                    background-color: #1F9700;
                    border: none;
                    border-radius: 5px;
                    text-decoration: none;
                }
                .footer {
                    margin-top: 20px;
                    text-align: center;
                    color: #666;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Email Verification</h2>
                </div>
                <div class="content">
                    <p>Hello,</p>
                    <p>Thank you for registering with Green Leaf. Please verify your email address by clicking the button below:</p>
                    <a href="${verifyEmailLink}" class="button" style="color: #fff;">Verify Email</a>
                    <p>If you did not create this account, please ignore this email or contact support if you have any questions.</p>
                </div>
                <div class="footer">
                    <p>This is an automated message. Please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>
        `
    };

    try {
        await sendMail(emailData);
    } catch (error) {
        throw error;
    }
};


// send forgot password link
export const sendResetPasswordLink = async (usr_email, token) => {

    const resetPassLink = `${process.env.BASE_URL}/reset-password?token=${token}`;
    const emailData = {
        from: process.env.FROM_GMAIL,
        email: usr_email,
        subject: 'Green Leaf Reset Password',
        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .container {
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    background-color: #f9f9f9;
                }
                .header {
                    background-color: #336d24;
                    color: #fff;
                    padding: 10px;
                    text-align: center;
                    border-radius: 5px 5px 0 0;
                }
                .content {
                    padding: 20px;
                    text-align: center;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    margin-top: 20px;
                    font-size: 16px;
                    background-color: #1F9700;
                    border: none;
                    border-radius: 5px;
                    text-decoration: none;
                }
                .footer {
                    margin-top: 20px;
                    text-align: center;
                    color: #666;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Password Reset Request</h2>
                </div>
                <div class="content">
                    <p>Hello there,</p>
                    <p>We received a request to reset your password. Click the button below to reset your password:</p>
                    <a href="${resetPassLink}" class="button" style="color: #fff;">Reset Password</a>
                    <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
                </div>
                <div class="footer">
                    <p>This is an automated message. Please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>
    `
    };

    try {
        await sendMail(emailData);
    } catch (error) {
        throw error;
    }
};



// send password successfully reset email
export const sendPasswordResetEmail = async (usr_email) => {

    const emailData = {
        from: process.env.FROM_GMAIL,
        email: usr_email,
        subject: 'Your Password Has Been Reset',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    .container {
                        font-family: Arial, sans-serif;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        background-color: #f9f9f9;
                    }
                    .header {
                        background-color: #336d24;
                        color: #fff;
                        padding: 10px;
                        text-align: center;
                        border-radius: 5px 5px 0 0;
                    }
                    .content {
                        padding: 20px;
                        text-align: center;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        margin-top: 20px;
                        font-size: 16px;
                        background-color: #1F9700;
                        border: none;
                        border-radius: 5px;
                        text-decoration: none;
                    }
                    .footer {
                        margin-top: 20px;
                        text-align: center;
                        color: #666;
                        font-size: 12px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Password Reset Successful</h2>
                    </div>
                    <div class="content">
                        <p>Hello there,</p>
                        <p>Your password has been successfully reset. You can now log in using your new password by clicking the button below:</p>
                        <a href="${process.env.BASE_URL}/login" class="button" style="color: #fff;">LogIn</a>
                        <p>If you did not request a password reset, please contact our support immediately.</p>
                    </div>
                    <div class="footer">
                        <p>This is an automated message. Please do not reply to this email.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
    try {
        await sendMail(emailData);
    } catch (error) {
        throw error;
    }
};