const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { isAuthenticated } = require('../middleware/auth');

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bucket = require('../config/gcs');

const newsUploadsDir = path.join(__dirname, '..', 'uploads', 'news');
const newsPublicDir = path.join(__dirname, '..', 'public', 'news');

function normalizeImageUrl(imageUrl) {
    if (!imageUrl) {
        return null;
    }

    const rawValue = String(imageUrl).trim();
    if (!rawValue) {
        return null;
    }

    if (/^https?:\/\//i.test(rawValue)) {
        return rawValue;
    }

    let normalized = rawValue.replace(/\\/g, '/').replace(/^\.\//, '');

    if (normalized.startsWith('/uploads/')) {
        return normalized;
    }

    if (normalized.startsWith('/public/')) {
        return normalized;
    }

    if (normalized.startsWith('uploads/')) {
        return `/${normalized}`;
    }

    if (normalized.startsWith('public/')) {
        return `/${normalized}`;
    }

    if (normalized.startsWith('/news/')) {
        return `/uploads${normalized}`;
    }

    if (normalized.startsWith('news/')) {
        return `/uploads/${normalized}`;
    }

    return normalized.startsWith('/') ? normalized : `/${normalized}`;
}

function resolveImageUrlForResponse(imageUrl) {
    const normalized = normalizeImageUrl(imageUrl);
    if (!normalized || /^https?:\/\//i.test(normalized)) {
        return normalized;
    }

    let filePath = null;
    if (normalized.startsWith('/public/news/')) {
        const filename = path.basename(normalized);
        filePath = path.join(newsPublicDir, filename);
        if (fs.existsSync(filePath)) {
            const mtime = fs.statSync(filePath).mtime.getTime();
            return `${normalized}?v=${mtime}`;
        }
        return null;
    }

    if (normalized.startsWith('/uploads/news/')) {
        const filename = path.basename(normalized);
        filePath = path.join(newsUploadsDir, filename);
        if (fs.existsSync(filePath)) {
            const mtime = fs.statSync(filePath).mtime.getTime();
            return `${normalized}?v=${mtime}`;
        }
        const publicPath = path.join(newsPublicDir, filename);
        if (fs.existsSync(publicPath)) {
            const mtime = fs.statSync(publicPath).mtime.getTime();
            return `/public/news/${filename}?v=${mtime}`;
        }
    }

    return normalized;
}

// Configure multer for memory storage (buffer upload)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

// Get all news articles (Public)
router.get('/api/articles', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                n.id, n.title, n.category, n.excerpt, n.content, 
                n.image_url, n.published_date, n.views, n.created_at,
                n.author_name, n.author_position,
                a.full_name as author
            FROM news_articles n
            LEFT JOIN admin_users a ON n.author_id = a.id
            WHERE n.is_published = TRUE
            ORDER BY n.published_date DESC
        `);
        const articles = result.rows.map(article => ({
            ...article,
            image_url: resolveImageUrlForResponse(article.image_url)
        }));

        res.json(articles);
    } catch (error) {
        console.error('Fetch articles error:', error);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});

// Get all notices (Public)
router.get('/api/notices', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT id, title, description, icon, priority
            FROM notices
            WHERE is_active = TRUE
            ORDER BY priority DESC, created_at DESC
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Fetch notices error:', error);
        res.status(500).json({ error: 'Failed to fetch notices' });
    }
});

// Get single article (Public) and increment views
router.get('/api/articles/:id', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                n.id, n.title, n.category, n.excerpt, n.content, 
                n.image_url, n.published_date, n.views,
                a.full_name as author
            FROM news_articles n
            LEFT JOIN admin_users a ON n.author_id = a.id
            WHERE n.id = $1 AND n.is_published = TRUE
        `, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Article not found' });
        }

        // Increment views
        await db.query('UPDATE news_articles SET views = views + 1 WHERE id = $1', [req.params.id]);

        res.json({
            ...result.rows[0],
            image_url: resolveImageUrlForResponse(result.rows[0].image_url)
        });
    } catch (error) {
        console.error('Fetch article error:', error);
        res.status(500).json({ error: 'Failed to fetch article' });
    }
});

// ADMIN ROUTES (Protected)

// Get all articles for admin
router.get('/api/admin/articles', isAuthenticated, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                n.id, n.title, n.category, n.excerpt, n.published_date, 
                n.is_published, n.views, n.created_at,
                n.author_name, n.author_position,
                a.full_name as author
            FROM news_articles n
            LEFT JOIN admin_users a ON n.author_id = a.id
            ORDER BY n.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Fetch admin articles error:', error);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});

// Create new article

router.post('/api/admin/articles', isAuthenticated, upload.single('image'), async (req, res) => {
    const { title, category, excerpt, content, published_date, is_published, author_name, author_position } = req.body;

    let image_url = null;
    if (req.file) {
        // Upload to Google Cloud Storage
        const uniqueName = 'news-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(req.file.originalname);
        const blob = bucket.file(uniqueName);
        const stream = blob.createWriteStream({ resumable: false, contentType: req.file.mimetype });
        stream.end(req.file.buffer);
        await new Promise((resolve, reject) => {
            stream.on('finish', resolve);
            stream.on('error', reject);
        });
        // No need to make the file public; bucket-level permissions apply
        image_url = `https://storage.googleapis.com/${bucket.name}/${uniqueName}`;
    }

    try {
        const result = await db.query(`
            INSERT INTO news_articles (title, category, excerpt, content, image_url, author_id, published_date, is_published, author_name, author_position)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id
        `, [title, category, excerpt, content, image_url, req.session.adminId, published_date, is_published || true, author_name, author_position]);

        res.json({ success: true, id: result.rows[0].id, message: 'Article created successfully' });
    } catch (error) {
        console.error('Create article error:', error);
        res.status(500).json({ error: 'Failed to create article' });
    }
});

// Update article

router.put('/api/admin/articles/:id', isAuthenticated, upload.single('image'), async (req, res) => {
    const { title, category, excerpt, content, published_date, is_published, author_name, author_position } = req.body;
    let image_url = req.body.existing_image;
    if (req.file) {
        // Upload to Google Cloud Storage
        const uniqueName = 'news-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(req.file.originalname);
        const blob = bucket.file(uniqueName);
        const stream = blob.createWriteStream({ resumable: false, contentType: req.file.mimetype });
        stream.end(req.file.buffer);
        await new Promise((resolve, reject) => {
            stream.on('finish', resolve);
            stream.on('error', reject);
        });
        // No need to make the file public; bucket-level permissions apply
        image_url = `https://storage.googleapis.com/${bucket.name}/${uniqueName}`;
    }

    try {
        await db.query(`
            UPDATE news_articles 
            SET title = $1, category = $2, excerpt = $3, content = $4, 
                image_url = $5, published_date = $6, is_published = $7, author_name = $8, author_position = $9
            WHERE id = $10
        `, [title, category, excerpt, content, image_url, published_date, is_published, author_name, author_position, req.params.id]);

        res.json({ success: true, message: 'Article updated successfully' });
    } catch (error) {
        console.error('Update article error:', error);
        res.status(500).json({ error: 'Failed to update article' });
    }
});

// Delete article
router.delete('/api/admin/articles/:id', isAuthenticated, async (req, res) => {
    try {
        await db.query('DELETE FROM news_articles WHERE id = $1', [req.params.id]);
        res.json({ success: true, message: 'Article deleted successfully' });
    } catch (error) {
        console.error('Delete article error:', error);
        res.status(500).json({ error: 'Failed to delete article' });
    }
});

// Get all notices for admin
router.get('/api/admin/notices', isAuthenticated, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT n.*, a.full_name as author
            FROM notices n
            LEFT JOIN admin_users a ON n.author_id = a.id
            ORDER BY n.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Fetch admin notices error:', error);
        res.status(500).json({ error: 'Failed to fetch notices' });
    }
});

// Create notice
router.post('/api/admin/notices', isAuthenticated, async (req, res) => {
    const { title, description, icon, priority, is_active } = req.body;

    try {
        const result = await db.query(`
            INSERT INTO notices (title, description, icon, priority, is_active, author_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `, [title, description, icon || 'fa-bullhorn', priority || 0, is_active !== false, req.session.adminId]);

        res.json({ success: true, id: result.rows[0].id, message: 'Notice created successfully' });
    } catch (error) {
        console.error('Create notice error:', error);
        res.status(500).json({ error: 'Failed to create notice' });
    }
});

// Update notice
router.put('/api/admin/notices/:id', isAuthenticated, async (req, res) => {
    const { title, description, icon, priority, is_active } = req.body;

    try {
        await db.query(`
            UPDATE notices 
            SET title = $1, description = $2, icon = $3, priority = $4, is_active = $5
            WHERE id = $6
        `, [title, description, icon, priority, is_active, req.params.id]);

        res.json({ success: true, message: 'Notice updated successfully' });
    } catch (error) {
        console.error('Update notice error:', error);
        res.status(500).json({ error: 'Failed to update notice' });
    }
});

// Delete notice
router.delete('/api/admin/notices/:id', isAuthenticated, async (req, res) => {
    try {
        await db.query('DELETE FROM notices WHERE id = $1', [req.params.id]);
        res.json({ success: true, message: 'Notice deleted successfully' });
    } catch (error) {
        console.error('Delete notice error:', error);
        res.status(500).json({ error: 'Failed to delete notice' });
    }
});

module.exports = router;
