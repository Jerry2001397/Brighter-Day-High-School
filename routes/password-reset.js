const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/database');

// One-time password reset endpoint
router.get('/reset-admin-password', async (req, res) => {
    try {
        // Generate fresh password hash in the current environment
        const password = 'admin123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Delete existing admin user
        await db.query(`DELETE FROM admin_users WHERE username = 'admin'`);

        // Insert new admin with fresh hash
        await db.query(`
            INSERT INTO admin_users (username, password, full_name, email, is_active) 
            VALUES ($1, $2, $3, $4, $5)
        `, ['admin', hashedPassword, 'System Administrator', 'admin@brighterday.edu.lr', true]);

        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Password Reset Complete</title>
                <style>
                    body { font-family: Arial; max-width: 600px; margin: 50px auto; padding: 20px; }
                    .success { background: #d4edda; color: #155724; padding: 20px; border-radius: 5px; border: 1px solid #c3e6cb; }
                    h1 { color: #155724; }
                    .code { background: #f8f9fa; padding: 10px; border-radius: 3px; font-family: monospace; margin: 15px 0; }
                    a { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #FDB913; color: white; text-decoration: none; border-radius: 5px; }
                    a:hover { background: #f39c12; }
                </style>
            </head>
            <body>
                <div class="success">
                    <h1>✓ Admin Password Reset Successfully!</h1>
                    <p>A fresh password hash has been generated in the production environment.</p>
                    
                    <h3>Login Credentials:</h3>
                    <div class="code">
                        Username: admin<br>
                        Password: admin123
                    </div>
                    
                    <p><strong>Generated Hash:</strong><br>
                    <code style="word-break: break-all; font-size: 0.85em;">${hashedPassword}</code></p>
                    
                    <a href="/admin/login">→ Go to Admin Login</a>
                </div>
            </body>
            </html>
        `);

    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Reset Error</title>
                <style>
                    body { font-family: Arial; max-width: 600px; margin: 50px auto; padding: 20px; }
                    .error { background: #f8d7da; color: #721c24; padding: 20px; border-radius: 5px; border: 1px solid #f5c6cb; }
                    pre { background: #f8f9fa; padding: 10px; border-radius: 3px; overflow-x: auto; }
                </style>
            </head>
            <body>
                <div class="error">
                    <h1>✗ Password Reset Failed</h1>
                    <p>An error occurred:</p>
                    <pre>${error.message}\n\n${error.stack}</pre>
                </div>
            </body>
            </html>
        `);
    }
});

module.exports = router;
