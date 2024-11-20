import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendMail = async ({ email, subject, html, attachments }) => {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
            tls: {
                // Do not fail on invalid certs
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: subject,
            html: html,
            attachments: attachments,

        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw error
    }
};