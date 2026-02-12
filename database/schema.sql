-- Brighter Day High School Database Schema
-- Create Database
CREATE DATABASE IF NOT EXISTS brighter_day_school;
USE brighter_day_school;

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- News Articles Table
CREATE TABLE IF NOT EXISTS news_articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    excerpt TEXT NOT NULL,
    content LONGTEXT NOT NULL,
    image_url VARCHAR(255),
    author_id INT,
    published_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_published BOOLEAN DEFAULT TRUE,
    views INT DEFAULT 0,
    FOREIGN KEY (author_id) REFERENCES admin_users(id) ON DELETE SET NULL
);

-- Notices Table
CREATE TABLE IF NOT EXISTS notices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) DEFAULT 'fa-bullhorn',
    priority INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    author_id INT,
    FOREIGN KEY (author_id) REFERENCES admin_users(id) ON DELETE SET NULL
);

-- Create default admin user (password: admin123)
-- Password hash for 'admin123' using bcrypt
INSERT INTO admin_users (username, password, full_name, email) 
VALUES ('admin', '$2a$10$8K1p/a0dL3.Kyqk0c7fZXu6rWzkK0RxQPVlwVw5YhN5jDHnmXN5yG', 'System Administrator', 'admin@brighterday.edu.lr')
ON DUPLICATE KEY UPDATE username=username;

-- Sample News Articles
INSERT INTO news_articles (title, category, excerpt, content, image_url, author_id, published_date, is_published) VALUES
(
    'WAEC Results Announcement 2025',
    'Academic',
    'We are pleased to announce that our students have achieved excellent results in the 2025 WAEC examinations.',
    '<p>Brighter Day High School is proud to announce that our graduating class of 2025 has achieved outstanding results in the West African Examinations Council (WAEC) examinations.</p><p>Out of 45 candidates, 42 students (93.3%) achieved Division 1 and 2, demonstrating the quality of education and dedication of both students and staff.</p><p>Special congratulations to our top performers who received straight A''s in their core subjects. This achievement reflects the hard work and commitment of our entire school community.</p>',
    NULL,
    1,
    '2025-08-15',
    TRUE
),
(
    'New Science Laboratory Inauguration',
    'Infrastructure',
    'Our state-of-the-art science laboratory has been officially opened, equipped with modern facilities for practical learning.',
    '<p>Brighter Day High School has officially inaugurated its new science laboratory, a major milestone in enhancing our educational facilities.</p><p>The laboratory is equipped with modern equipment for Physics, Chemistry, and Biology practicals, enabling students to gain hands-on experience in scientific experimentation.</p><p>We thank our partners and donors who made this project possible. This facility will significantly improve the quality of science education at our institution.</p>',
    NULL,
    1,
    '2025-09-01',
    TRUE
),
(
    'Inter-School Sports Competition 2025',
    'Sports',
    'Our school teams participated in the annual inter-school sports competition, bringing home multiple medals and trophies.',
    '<p>Brighter Day High School students showcased exceptional athletic talent at the 2025 Inter-School Sports Competition held in Monrovia.</p><p>Our teams competed in football, basketball, track and field, and volleyball events. We secured 1st place in basketball and 2nd place in track and field events.</p><p>Congratulations to all our athletes, coaches, and sports department for their dedication and outstanding performance!</p>',
    NULL,
    1,
    '2025-11-20',
    TRUE
);

-- Sample Notices
INSERT INTO notices (title, description, icon, priority, is_active, author_id) VALUES
('Exam Schedule Released', 'The second semester examination schedule has been posted on the notice board. Students should check their timetables.', 'fa-calendar-check', 1, TRUE, 1),
('School Fees Reminder', 'Parents are reminded that the deadline for third installment payment is February 28, 2026.', 'fa-money-bill-wave', 2, TRUE, 1),
('Parents Meeting', 'A general parents meeting is scheduled for February 25, 2026 at 10:00 AM in the school auditorium.', 'fa-users', 1, TRUE, 1),
('Library Hours Extended', 'The school library will now be open until 6:00 PM on weekdays to support students during exam preparation.', 'fa-book', 0, TRUE, 1);
