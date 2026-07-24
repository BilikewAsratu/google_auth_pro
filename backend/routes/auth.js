import express from 'express';
import { pool } from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { body, validationResult } from 'express-validator';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// 1. Email Checker (Step 1)
router.post('/check-email', 
    body('email').isEmail().withMessage('Invalid email format'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

        const { email } = req.body;
        try {
            const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
            
            // The constraint: If not registered -> ERROR
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Email not registered. Please sign up first.' });
            }

            // If registered -> Generate OTP
            const user = rows[0];
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
            const hashedOtp = await bcrypt.hash(otpCode, 10);
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

            // Store/Update OTP in DB
            await pool.query(
                'INSERT INTO otps (email, code, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE code = ?, expires_at = ?',
                [email, hashedOtp, expiresAt, hashedOtp, expiresAt]
            );

            // Send email
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
            });
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Your Login Verification Code',
                html: `<h3>Hi ${email},</h3><p>Your verification code is: <b>${otpCode}</b></p><p>It expires in 5 minutes.</p>`
            });

            res.json({ message: 'Verification code sent to your email!', email });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
);

// 2. Verify OTP (Step 2)
router.post('/verify-otp', async (req, res) => {
    const { email, code } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM otps WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(400).json({ error: 'No OTP requested for this email' });

        const otpData = rows[0];
        const isValid = await bcrypt.compare(code, otpData.code);
        const isExpired = new Date() > new Date(otpData.expires_at);

        if (!isValid) return res.status(401).json({ error: 'Invalid verification code' });
        if (isExpired) return res.status(401).json({ error: 'Code has expired. Request a new one.' });

        // Success! Fetch user role and generate JWT
        const [userRows] = await pool.query('SELECT id, email, role FROM users WHERE email = ?', [email]);
        const user = userRows[0];

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Delete the used OTP
        await pool.query('DELETE FROM otps WHERE email = ?', [email]);

        res.json({ message: 'Login successful!', token, user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;