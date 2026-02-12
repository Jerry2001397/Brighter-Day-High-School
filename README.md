# Brighter Day Elementary, JR & SR High School Website

![School Logo](images/logo.png)

## About This Project

This is the official website for **Brighter Day Elementary, Junior & Senior High School** located in Sou-Clinc Community, Paynesville, Liberia. The website showcases the school's programs, staff, graduates, and provides essential information to students, parents, and the community.

## Features

- **Professional Design**: Modern, responsive website design using the school's official colors (Yellow and Blue)
- **Multi-Page Navigation**: Easy access to all important information through an intuitive navigation menu
- **Mobile Responsive**: Fully responsive design that works on all devices
- **Interactive Elements**: Smooth animations, hover effects, and interactive navigation
- **Contact Form**: Functional contact form for inquiries and communication

## Pages Included

1. **Home** (`index.html`) - Welcome page with school overview
2. **About** (`about.html`) - Mission, vision, values, and why choose our school
3. **Administrators** (`administrators.html`) - School leadership team
4. **Teaching Staffs** (`teaching-staffs.html`) - Faculty members by department
5. **Our Graduates** (`graduates.html`) - Alumni success stories and statistics
6. **Contact** (`contact.html`) - Contact information and inquiry form

## Color Scheme

The website uses the official school colors from the BRIDAPS logo:
- **Primary Yellow**: #FDB913
- **Primary Blue**: #2E86C1
- **Dark Blue**: #1B4F72
- **Light Blue**: #5DADE2

## Technologies Used

- **HTML5** - Structure and content
- **CSS3** - Styling and animations
- **JavaScript** - Interactivity and dynamic features
- **Font Awesome** - Icons
- **Google Fonts** - Typography
- **Node.js & Express** - Backend server for CMS
- **PostgreSQL** - Database for news articles and notices
- **bcryptjs** - Password hashing for admin authentication

## CMS System

The website includes a complete Content Management System (CMS) for managing news articles and notices.

### Features:
- Admin authentication with bcrypt password hashing
- Create, read, update, delete (CRUD) operations for news articles
- Create, read, update, delete (CRUD) operations for notices
- Image upload functionality for news articles
- View tracking for articles
- Dashboard with statistics and recent content

### Admin Access:
- Login Page: `/admin/login`
- Dashboard: `/admin/dashboard` (requires authentication)
- Default Credentials:
  - Username: `admin`
  - Password: `admin123`
  - **⚠️ Change these credentials in production!**

### API Endpoints:
- `GET /news/api/articles` - Get all published articles
- `GET /news/api/notices` - Get all active notices
- `GET /news/api/articles/:id` - Get single article
- Protected admin endpoints require authentication

## File Structure

```
Brighter-Day-High-School/
│
├── index.html                  # Home page
├── about.html                  # About page
├── administrators.html         # Administrators page
├── teaching-staffs.html        # Teaching staff page
├── graduates.html              # Graduates page
├── contact.html                # Contact page
├── news.html                   # News page (dynamic content)
├── README.md                   # This file
├── package.json                # Node.js dependencies
├── server.js                   # Express server
├── .env                        # Environment variables (not in git)
├── .env.example                # Example environment configuration
│
├── config/
│   └── database.js             # PostgreSQL connection config
│
├── middleware/
│   └── auth.js                 # Authentication middleware
│
├── routes/
│   ├── admin.js                # Admin authentication routes
│   └── news.js                 # News and notices API routes
│
├── public/
### For Static Website Only:

1. **Replace Placeholder Images**:
   - Add your school logo as `images/logo.png`
   - Replace placeholder images for administrators, teachers, and graduates

2. **Update Contact Information**:
   - Edit phone numbers in all HTML files (replace +231-XXX-XXXX)
   - Update email addresses if different from the defaults
   - Update social media links in the footer

3. **Customize Staff Information**:
   - Replace `[Name]` placeholders with actual names
   - Add qualifications and descriptions
   - Upload actual photos

### For Full CMS Setup:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set Up PostgreSQL Database**:
   - Install PostgreSQL on your system
   - Create a database named `brighter_day_school`
   - Run the schema file:
     ```bash
     psql -U postgres -d brighter_day_school -f database/schema.sql
     ```

3. **Configure Environment Variables**:
   - Copy `.env.example` to `.env`
   - Update `DATABASE_URL` with your PostgreSQL connection string
   - Example: `postgresql://postgres:password@localhost:5432/brighter_day_school`

4. **Start the Server**:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:3000`

5. **Access Admin Panel**:
   - Navigate to `http://localhost:3000/admin/login`
   - Login with default credentials (admin/admin123)
   - **Change the default password immediately!**

6. **Create Uploads Directory**:
   The server will automatically create `uploads/news/` directory for image uploads.
    └── ...                     # Other images
```
├── graduates.html          # Graduates page
├── contact.html            # Contact page
├── README.md              # This file
│
├── css/
│   └── style.css          # Main stylesheet
│
├── js/
│   └── script.js          # JavaScript functionality
│
└── images/
    ├── logo.png           # School logo (add your actual logo here)
    ├── admin-placeholder.jpg
    ├── teacher-placeholder.jpg
    ├── graduate-placeholder.jpg
    └── alumni-placeholder.jpg
```

## Setup Instructions

1. **Replace Placeholder Images**:
   - Add your school logo as `images/logo.png`
   - Replace placeholder images for administrators, teachers, and graduates

2. **Update Contact Information**:
   - Edit phone numbers in all HTML files (replace +231-XXX-XXXX)
   - Update email addresses if different from the defaults
   - Update social media links in the footer

3. **Customize Staff Information**:
   - Replace `[Name]` placeholders with actual names
   - Add qualifications and descriptions
   - Upload actual photos

4. **Configure Contact Form**:
   - The contact form currently displays an alert
   - To make it functional, configure a backend service or email handler
   - Popular options: FormSpree, EmailJS, or custom PHP handler

## Customization Guide

### Updating Colors
Edit the CSS variables in `css/style.css`:
```css
:root {
    --primary-yellow: #FDB913;
    --primary-blue: #2E86C1;
    --dark-blue: #1B4F72;
    /* ... other colors */
}
```

### Adding Content
- All content is in standard HTML format
- Simply edit the HTML files to update text, add sections, etc.
- Classes are well-organized and reusable

### Adding New Pages
1. Create a new HTML file
2. Copy the navigation and footer from existing pages
3. Add your content in the main section
4. UDeploying to Render.com (Recommended - Free Tier):

1. **Create Render Account**:
   - Go to https://render.com and sign up
   - Connect your GitHub account

2. **Create PostgreSQL Database**:
   - Click "New +" and select "PostgreSQL"
   - Name: `brighter-day-db`
   - Select Free tier
   - Click "Create Database"
   - Copy the "Internal Database URL" (starts with `postgresql://`)

3. **Create Web Service**:
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository
   - Name: `brighter-day-school`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Select Free tier

4. **Set Environment Variables**:
   In your web service settings, add:
   - `DATABASE_URL` = (paste the Internal Database URL from step 2)
   - `SESSION_SECRET` = (any random string, e.g., `your_random_secret_key_12345`)
   - `NODE_ENV` = `production`

5. **Initialize Database**:
   - In Render dashboard, open your PostgreSQL database
   - Click "Connect" -> "PSQL Command"
   - Copy and paste the contents of `database/schema.sql`
   - Execute to create tables and initial data

6. **Deploy**:
   - Render will automatically deploy your app
   - Your site will be live at: `https://brighter-day-school.onrender.com`

### Using GitHub Pages (Static Site Only):
1. Go to repository Settings
2. Navigate to Pages section
3. Select main branch as source
4. Your site will be published at: `https://yourusername.github.io/Brighter-Day-High-School`

**Note**: GitHub Pages only supports static files. For the CMS to work, you need a Node.js hosting service like Render.

### Using Other Hosting:
- For CMS: Use any Node.js hosting (Heroku, Railway, DigitalOcean, etc.)
- Ensure PostgreSQL database is available
- Set environment variables as shown in `.env.example`
- For static site only: Upload all files to web hosting via FTP
## Responsive Breakpoints

- Desktop: > 768px
- Tablet: 481px - 768px
- Mobile: < 480px

## Future Enhancements

Consider adding:
- [ ] Online admission form
- [ ] Student/parent portal
- [ ] News and announcements section
- [ ] Photo gallery
- [ ] Calendar of events
- [ ] Download section for forms/documents
- [ ] Blog or news section
- [ ] Live chat support
- [ ] Multi-language support

## Deployment

### Using GitHub Pages:
1. Go to repository Settings
2. Navigate to Pages section
3. Select main branch as source
4. Your site will be published at: `https://yourusername.github.io/Brighter-Day-High-School`

### Using Other Hosting:
- Upload all files to your web hosting via FTP
- Ensure folder structure is maintained
- Point your domain to the hosting directory

## Support and Maintenance

For technical support or website updates, contact:
- Email: webmaster@brighterdayschool.edu.lr
- Phone: +231-XXX-XXXX

## License

© 2026 Brighter Day Elementary, JR & SR High School. All rights reserved.

## Credits

- Design and Development: Custom built for Brighter Day School
- Icons: Font Awesome (https://fontawesome.com)
- Color Scheme: Based on official school logo

---

**BRIDAPS - MOTTO: Learning To Teach Others**