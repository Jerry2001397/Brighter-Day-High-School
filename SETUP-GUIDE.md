# Brighter Day High School - News Management System

## Overview
This is a complete Node.js + Express + MySQL content management system for managing news articles and notices on the Brighter Day High School website. The system includes an admin dashboard for posting and managing content.

## Features
- ✅ Secure admin authentication with bcrypt password hashing
- ✅ Create, edit, and delete news articles
- ✅ Create, edit, and delete notices/announcements
- ✅ Image upload support for news articles
- ✅ Dynamic content loading on the public website
- ✅ Article view tracking
- ✅ Category management
- ✅ Priority-based notice ordering
- ✅ Responsive admin dashboard
- ✅ Session-based authentication

## Technology Stack
- **Backend:** Node.js with Express.js
- **Database:** MySQL
- **Authentication:** Express-session + bcryptjs
- **File Upload:** Multer
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)

## Prerequisites
Before you begin, ensure you have the following installed:
- Node.js (v14 or higher) - [Download here](https://nodejs.org/)
- MySQL Server (v5.7 or higher) - [Download here](https://dev.mysql.com/downloads/)
- A text editor (VS Code recommended)

## Installation Steps

### Step 1: Install Node.js and MySQL
1. Download and install Node.js from https://nodejs.org/
2. Download and install MySQL from https://dev.mysql.com/downloads/
3. During MySQL installation, remember your root password

### Step 2: Set Up the Database
1. Open MySQL Workbench or Command Line
2. Run the following commands:
```sql
-- Navigate to the database folder in your project
-- Then execute the schema.sql file
SOURCE /path/to/your/project/database/schema.sql;
```

Or manually:
- Open MySQL Workbench
- Connect to your MySQL server
- Click File → Open SQL Script
- Navigate to `database/schema.sql`
- Click Execute (lightning bolt icon)

This will:
- Create the `brighter_day_school` database
- Create tables for admin users, news articles, and notices
- Insert a default admin account (username: `admin`, password: `admin123`)
- Insert sample data

### Step 3: Configure Environment Variables
1. Copy `.env.example` to create `.env`:
```bash
copy .env.example .env
```

2. Edit `.env` file with your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=brighter_day_school
DB_PORT=3306

PORT=3000
NODE_ENV=development

SESSION_SECRET=change_this_to_a_random_string_abc123xyz
```

**Important:** 
- Replace `your_mysql_password_here` with your actual MySQL root password
- Change `SESSION_SECRET` to a random string for security

### Step 4: Install Dependencies
Open Command Prompt or PowerShell in the project folder and run:
```bash
npm install
```

This will install all required packages:
- express
- mysql2
- bcryptjs
- express-session
- dotenv
- body-parser
- multer
- express-validator

### Step 5: Start the Server
Run the following command:
```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

You should see:
```
================================
🚀 Server running on port 3000
🌐 Website: http://localhost:3000
🔐 Admin Panel: http://localhost:3000/admin/login
================================
```

## Using the System

### Accessing the Admin Panel
1. Open your browser and go to: `http://localhost:3000/admin/login`
2. Login with default credentials:
   - **Username:** admin
   - **Password:** admin123
3. **IMPORTANT:** Change the default password after first login!

### Managing News Articles
1. Click "News Articles" in the sidebar
2. Click "Add New Article" button
3. Fill in the form:
   - **Title:** Article headline
   - **Category:** Choose from Academic, Sports, Infrastructure, Events, etc.
   - **Excerpt:** Short summary (shows on cards)
   - **Full Content:** Complete article text (can include HTML)
   - **Image:** Upload an image (optional, max 5MB)
   - **Published Date:** Article date
   - **Published:** Check to make visible on website
4. Click "Save Article"

To edit or delete:
- Click "Edit" button to modify
- Click "Delete" button to remove (will ask for confirmation)

### Managing Notices
1. Click "Notices" in the sidebar
2. Click "Add New Notice" button
3. Fill in the form:
   - **Title:** Notice headline
   - **Description:** Notice text
   - **Icon:** FontAwesome icon class (e.g., `fa-calendar-check`, `fa-money-bill-wave`)
   - **Priority:** High, Medium, or Low (affects display order)
   - **Active:** Check to make visible on website
4. Click "Save Notice"

### Viewing on the Website
1. Go to: `http://localhost:3000/news.html`
2. All published articles and active notices will display automatically
3. The page refreshes data from the database on each visit

## File Structure
```
Brighter-Day-High-School/
│
├── config/
│   └── database.js           # Database connection configuration
│
├── database/
│   └── schema.sql            # Database schema and initial data
│
├── middleware/
│   └── auth.js               # Authentication middleware
│
├── routes/
│   ├── admin.js              # Admin authentication routes
│   └── news.js               # News and notices API routes
│
├── public/
│   ├── admin-login.html      # Admin login page
│   └── admin-dashboard.html  # Admin dashboard interface
│
├── js/
│   ├── script.js             # Main website JavaScript
│   └── admin-dashboard.js    # Admin dashboard JavaScript
│
├── css/
│   └── style.css             # Website styles (includes admin styles)
│
├── uploads/
│   └── news/                 # Uploaded news images
│
├── server.js                 # Main Express server
├── package.json              # Node.js dependencies
├── .env.example              # Environment variables template
├── .env                      # Your actual environment variables (DO NOT commit)
├── .gitignore                # Git ignore file
└── SETUP-GUIDE.md            # This file
```

## Database Schema

### admin_users Table
- `id` - Primary key
- `username` - Unique login name
- `password` - Hashed password
- `full_name` - Admin's full name
- `email` - Email address
- `created_at` - Account creation date
- `last_login` - Last login timestamp
- `is_active` - Account status

### news_articles Table
- `id` - Primary key
- `title` - Article title
- `category` - Article category
- `excerpt` - Short summary
- `content` - Full article text
- `image_url` - Path to uploaded image
- `author_id` - Foreign key to admin_users
- `published_date` - Publication date
- `is_published` - Visibility status
- `views` - View count
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### notices Table
- `id` - Primary key
- `title` - Notice title
- `description` - Notice text
- `icon` - FontAwesome icon class
- `priority` - Display priority (0-2)
- `is_active` - Visibility status
- `author_id` - Foreign key to admin_users
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## API Endpoints

### Public Endpoints
- `GET /news/api/articles` - Get all published articles
- `GET /news/api/articles/:id` - Get single article (increments views)
- `GET /news/api/notices` - Get all active notices

### Admin Endpoints (Requires Authentication)
- `POST /admin/login` - Admin login
- `POST /admin/logout` - Admin logout
- `GET /admin/dashboard` - Dashboard page
- `GET /admin/api/stats` - Dashboard statistics

- `GET /news/api/admin/articles` - Get all articles (including drafts)
- `POST /news/api/admin/articles` - Create new article
- `PUT /news/api/admin/articles/:id` - Update article
- `DELETE /news/api/admin/articles/:id` - Delete article

- `GET /news/api/admin/notices` - Get all notices
- `POST /news/api/admin/notices` - Create new notice
- `PUT /news/api/admin/notices/:id` - Update notice
- `DELETE /news/api/admin/notices/:id` - Delete notice

## Security Best Practices

1. **Change Default Password**
   - Login with default credentials
   - Go to MySQL and update password:
   ```sql
   UPDATE admin_users 
   SET password = '$2a$10$NEW_HASH_HERE' 
   WHERE username = 'admin';
   ```

2. **Environment Variables**
   - Never commit `.env` file to version control
   - Use strong, random SESSION_SECRET
   - Keep database credentials secure

3. **File Uploads**
   - Maximum file size: 5MB
   - Allowed formats: jpeg, jpg, png, gif
   - Files stored in `uploads/news/` directory

4. **Sessions**
   - Sessions expire after 24 hours
   - Logout destroys session immediately

## Troubleshooting

### Database Connection Error
**Error:** "Error connecting to database"
**Solution:** 
- Check MySQL is running
- Verify credentials in `.env` file
- Ensure database exists: `CREATE DATABASE brighter_day_school;`

### Port Already in Use
**Error:** "Port 3000 is already in use"
**Solution:**
- Change PORT in `.env` to 3001 or another available port
- Or stop the process using port 3000

### Cannot Login
**Problem:** Admin login fails
**Solution:**
- Verify default credentials: admin / admin123
- Check admin_users table exists with default user
- Clear browser cache/cookies

### News Not Loading on Website
**Problem:** News page shows "Loading..." forever
**Solution:**
- Check server is running
- Open browser console (F12) for error messages
- Verify database has published articles
- Check API endpoint: `http://localhost:3000/news/api/articles`

### Image Upload Fails
**Problem:** Cannot upload images
**Solution:**
- Check `uploads/news/` folder exists
- Verify file size < 5MB
- Use allowed formats (jpg, png, gif)
- Check folder permissions

## Changing Admin Password

To change the admin password securely:

1. Generate new password hash using bcrypt:
```javascript
const bcrypt = require('bcryptjs');
const newPassword = 'your_new_password_here';
bcrypt.hash(newPassword, 10, (err, hash) => {
    console.log(hash);
});
```

2. Update in database:
```sql
UPDATE admin_users 
SET password = 'paste_hash_here' 
WHERE username = 'admin';
```

## Adding More Admins

To add additional admin users:

```sql
INSERT INTO admin_users (username, password, full_name, email) 
VALUES (
    'newadmin', 
    'bcrypt_hash_here',
    'Admin Full Name',
    'admin@email.com'
);
```

## Deployment to Production

When ready to deploy to a live server:

1. **Update .env for production:**
```env
NODE_ENV=production
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
SESSION_SECRET=very_strong_random_string
```

2. **Use process manager (PM2):**
```bash
npm install -g pm2
pm2 start server.js --name bdhs-cms
pm2 save
pm2 startup
```

3. **Set up reverse proxy** (nginx/Apache)
4. **Enable HTTPS** with SSL certificate
5. **Configure firewall** to allow only necessary ports

## Support

For issues or questions:
- Check this guide first
- Review error messages in console
- Check browser console (F12) for frontend errors
- Verify database connection and data

## Credits
Developed by Tech Bridge Liberia (TBL)
For Brighter Day Elementary, Junior & Senior High School

---

**Remember to keep your .env file secure and never share database credentials!**
