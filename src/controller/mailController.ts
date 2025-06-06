// src/utils/mailService.ts
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

export const sendEmail = async (to: string, subject: string, html: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,      // e.g. yourname@gmail.com
            pass: process.env.EMAIL_PASSWORD,  // use App Password if 2FA is on
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
