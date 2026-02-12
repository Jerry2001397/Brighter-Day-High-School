const express = require('express');
const router = express.Router();
const db = require('../config/database');

// One-time database setup endpoint
router.get('/setup-database', async (req, res) => {
    try {
        // Create admin_users table
        await db.query(`
            CREATE TABLE IF NOT EXISTS admin_users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                full_name VARCHAR(100) NOT NULL,
                email VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP NULL,
                is_active BOOLEAN DEFAULT TRUE
            )
        `);

        // Create news_articles table
        await db.query(`
            CREATE TABLE IF NOT EXISTS news_articles (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                category VARCHAR(50) NOT NULL,
                excerpt TEXT NOT NULL,
                content TEXT NOT NULL,
                image_url VARCHAR(255),
                author_id INT,
                published_date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_published BOOLEAN DEFAULT TRUE,
                views INT DEFAULT 0,
                FOREIGN KEY (author_id) REFERENCES admin_users(id) ON DELETE SET NULL
            )
        `);

        // Create notices table
        await db.query(`
            CREATE TABLE IF NOT EXISTS notices (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                icon VARCHAR(50) DEFAULT 'fa-bullhorn',
                priority INT DEFAULT 0,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                author_id INT,
                FOREIGN KEY (author_id) REFERENCES admin_users(id) ON DELETE SET NULL
            )
        `);

        // Create trigger function for updated_at
        await db.query(`
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ language 'plpgsql'
        `);

        // Create triggers
        await db.query(`
            DROP TRIGGER IF EXISTS update_news_articles_updated_at ON news_articles;
            CREATE TRIGGER update_news_articles_updated_at BEFORE UPDATE ON news_articles
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
        `);

        await db.query(`
            DROP TRIGGER IF EXISTS update_notices_updated_at ON notices;
            CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON notices
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
        `);

        // Insert default admin user (password: admin123)
        await db.query(`
            INSERT INTO admin_users (username, password, full_name, email) 
            VALUES ('admin', '$2a$10$8K1p/a0dL3.Kyqk0c7fZXu6rWzkK0RxQPVlwVw5YhN5jDHnmXN5yG', 'System Administrator', 'admin@brighterday.edu.lr')
            ON CONFLICT (username) DO NOTHING
        `);

        // Insert sample news articles
        await db.query(`
            INSERT INTO news_articles (title, category, excerpt, content, image_url, author_id, published_date, is_published) 
            SELECT * FROM (VALUES
                (
                    'WAEC Results Announcement 2025',
                    'Academic',
                    'We are pleased to announce that our students have achieved excellent results in the 2025 WAEC examinations.',
                    '<p>Brighter Day High School is proud to announce that our graduating class of 2025 has achieved outstanding results in the West African Examinations Council (WAEC) examinations.</p><p>Out of 45 candidates, 42 students (93.3%) achieved Division 1 and 2, demonstrating the quality of education and dedication of both students and staff.</p><p>Special congratulations to our top performers who received straight A''s in their core subjects. This achievement reflects the hard work and commitment of our entire school community.</p>',
                    NULL,
                    1,
                    '2025-08-15'::DATE,
                    TRUE
                ),
                (
                    'New Science Laboratory Inauguration',
                    'Infrastructure',
                    'Our state-of-the-art science laboratory has been officially opened, equipped with modern facilities for practical learning.',
                    '<p>Brighter Day High School has officially inaugurated its new science laboratory, a major milestone in enhancing our educational facilities.</p><p>The laboratory is equipped with modern equipment for Physics, Chemistry, and Biology practicals, enabling students to gain hands-on experience in scientific experimentation.</p><p>We thank our partners and donors who made this project possible. This facility will significantly improve the quality of science education at our institution.</p>',
                    NULL,
                    1,
                    '2025-09-01'::DATE,
                    TRUE
                ),
                (
                    'Inter-School Sports Competition 2025',
                    'Sports',
                    'Our school teams participated in the annual inter-school sports competition, bringing home multiple medals and trophies.',
                    '<p>Brighter Day High School students showcased exceptional athletic talent at the 2025 Inter-School Sports Competition held in Monrovia.</p><p>Our teams competed in football, basketball, track and field, and volleyball events. We secured 1st place in basketball and 2nd place in track and field events.</p><p>Congratulations to all our athletes, coaches, and sports department for their dedication and outstanding performance!</p>',
                    NULL,
                    1,
                    '2025-11-20'::DATE,
                    TRUE
                )
            ) AS v(title, category, excerpt, content, image_url, author_id, published_date, is_published)
            WHERE NOT EXISTS (SELECT 1 FROM news_articles LIMIT 1)
        `);

        // Insert sample notices
        await db.query(`
            INSERT INTO notices (title, description, icon, priority, is_active, author_id) 
            SELECT * FROM (VALUES
                ('Exam Schedule Released', 'The second semester examination schedule has been posted on the notice board. Students should check their timetables.', 'fa-calendar-check', 1, TRUE, 1),
                ('School Fees Reminder', 'Parents are reminded that the deadline for third installment payment is February 28, 2026.', 'fa-money-bill-wave', 2, TRUE, 1),
                ('Parents Meeting', 'A general parents meeting is scheduled for February 25, 2026 at 10:00 AM in the school auditorium.', 'fa-users', 1, TRUE, 1),
                ('Library Hours Extended', 'The school library will now be open until 6:00 PM on weekdays to support students during exam preparation.', 'fa-book', 0, TRUE, 1)
            ) AS v(title, description, icon, priority, is_active, author_id)
            WHERE NOT EXISTS (SELECT 1 FROM notices LIMIT 1)
        `);

        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Database Setup Complete</title>
                <style>
                    body { font-family: Arial; max-width: 600px; margin: 50px auto; padding: 20px; }
                    .success { background: #d4edda; color: #155724; padding: 20px; border-radius: 5px; border: 1px solid #c3e6cb; }
                    .info { background: #d1ecf1; color: #0c5460; padding: 15px; border-radius: 5px; margin-top: 20px; border: 1px solid #bee5eb; }
                    h1 { color: #155724; }
                    a { color: #007bff; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                    .code { background: #f8f9fa; padding: 10px; border-radius: 3px; font-family: monospace; }
                </style>
            </head>
            <body>
                <div class="success">
                    <h1>✓ Database Setup Complete!</h1>
                    <p>All tables, triggers, and sample data have been created successfully.</p>
                </div>
                
                <div class="info">
                    <h3>What was created:</h3>
                    <ul>
                        <li>✓ admin_users table</li>
                        <li>✓ news_articles table</li>
                        <li>✓ notices table</li>
                        <li>✓ Database triggers for auto-updating timestamps</li>
                        <li>✓ Default admin account</li>
                        <li>✓ 3 sample news articles</li>
                        <li>✓ 4 sample notices</li>
                    </ul>
                    
                    <h3>Admin Login Credentials:</h3>
                    <div class="code">
                        Username: admin<br>
                        Password: admin123
                    </div>
                    
                    <h3>Next Steps:</h3>
                    <p><a href="/admin/login">→ Go to Admin Login</a></p>
                    <p><a href="/news.html">→ View News Page</a></p>
                    <p><a href="/">→ Go to Homepage</a></p>
                    
                    <p><strong>Security Note:</strong> For security, you should delete or disable this setup route in production by removing it from server.js</p>
                </div>
            </body>
            </html>
        `);

    } catch (error) {
        console.error('Database setup error:', error);
        res.status(500).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Setup Error</title>
                <style>
                    body { font-family: Arial; max-width: 600px; margin: 50px auto; padding: 20px; }
                    .error { background: #f8d7da; color: #721c24; padding: 20px; border-radius: 5px; border: 1px solid #f5c6cb; }
                    pre { background: #f8f9fa; padding: 10px; border-radius: 3px; overflow-x: auto; }
                </style>
            </head>
            <body>
                <div class="error">
                    <h1>✗ Database Setup Failed</h1>
                    <p>An error occurred while setting up the database:</p>
                    <pre>${error.message}\n\n${error.stack}</pre>
                </div>
            </body>
            </html>
        `);
    }
});

module.exports = router;
