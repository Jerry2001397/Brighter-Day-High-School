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

## File Structure

```
Brighter-Day-High-School/
│
├── index.html              # Home page
├── about.html              # About page
├── administrators.html     # Administrators page
├── teaching-staffs.html    # Teaching staff page
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
4. Update navigation links in all pages

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

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

**BRIDAPS - Empowering minds, Building futures**