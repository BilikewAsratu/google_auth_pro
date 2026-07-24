import express from 'express';
import { pool } from '../db.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Middleware to check if Admin
const isAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Get all users (Admin only)
router.get('/users', isAdmin, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, email, role, is_verified, created_at FROM users');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete a user (Admin only)
router.delete('/users/:id', isAdmin, async (req, res) => {
    try {
        await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;