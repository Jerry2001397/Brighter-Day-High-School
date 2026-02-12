const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { isAuthenticated, isNotAuthenticated } = require('../middleware/auth');

// Login Page
router.get('/login', isNotAuthenticated, (req, res) => {
    res.sendFile('admin-login.html', { root: './public' });
});

// Login Process
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await db.query(
            'SELECT * FROM admin_users WHERE username = $1 AND is_active = TRUE',
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        const user = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        // Update last login
        await db.query('UPDATE admin_users SET last_login = NOW() WHERE id = $1', [user.id]);

        // Set session
        req.session.adminId = user.id;
        req.session.username = user.username;
        req.session.fullName = user.full_name;

        res.json({ success: true, message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Dashboard
router.get('/dashboard', isAuthenticated, (req, res) => {
    res.sendFile('admin-dashboard.html', { root: './public' });
});

// Get Dashboard Stats
router.get('/api/stats', isAuthenticated, async (req, res) => {
    try {
        const newsCount = await db.query('SELECT COUNT(*) as count FROM news_articles WHERE is_published = TRUE');
        const noticesCount = await db.query('SELECT COUNT(*) as count FROM notices WHERE is_active = TRUE');
        const totalViews = await db.query('SELECT SUM(views) as total FROM news_articles');
        const recentNews = await db.query(
            'SELECT id, title, category, published_date, views FROM news_articles ORDER BY created_at DESC LIMIT 5'
        );

        res.json({
            newsCount: parseInt(newsCount.rows[0].count),
            noticesCount: parseInt(noticesCount.rows[0].count),
            totalViews: parseInt(totalViews.rows[0].total) || 0,
            recentNews: recentNews.rows
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Logout failed' });
        }
        res.json({ success: true, message: 'Logged out successfully' });
    });
});

module.exports = router;
