-- Create database
CREATE DATABASE IF NOT EXISTS portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portfolio_db;

-- Users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_en VARCHAR(100) NOT NULL,
    name_es VARCHAR(100) NOT NULL,
    percentage INT NOT NULL,
    icon VARCHAR(50),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title_en VARCHAR(200) NOT NULL,
    title_es VARCHAR(200) NOT NULL,
    description_en TEXT NOT NULL,
    description_es TEXT NOT NULL,
    image VARCHAR(255),
    project_url VARCHAR(255),
    github_url VARCHAR(255),
    technologies TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Work Experience table
CREATE TABLE IF NOT EXISTS work_experience (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_en VARCHAR(200) NOT NULL,
    company_es VARCHAR(200) NOT NULL,
    position_en VARCHAR(200) NOT NULL,
    position_es VARCHAR(200) NOT NULL,
    description_en TEXT NOT NULL,
    description_es TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT 0,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    value_en TEXT,
    value_es TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default admin user (password: admin123)
INSERT INTO users (username, password, email) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@portfolio.com');

-- Insert default site settings
INSERT INTO site_settings (setting_key, value_en, value_es) VALUES
('site_title', 'My Portfolio', 'Mi Portafolio'),
('site_description', 'Professional Portfolio Website', 'Sitio Web de Portafolio Profesional'),
('welcome_text', 'Welcome to my portfolio', 'Bienvenido a mi portafolio');

-- Insert sample skills
INSERT INTO skills (name_en, name_es, percentage, icon, display_order) VALUES
('PHP', 'PHP', 85, 'fab fa-php', 1),
('JavaScript', 'JavaScript', 80, 'fab fa-js', 2),
('HTML/CSS', 'HTML/CSS', 90, 'fab fa-html5', 3),
('MySQL', 'MySQL', 75, 'fas fa-database', 4);

-- Insert sample project
INSERT INTO projects (title_en, title_es, description_en, description_es, technologies, display_order) VALUES
('Portfolio Website', 'Sitio Web de Portafolio', 
 'A dynamic portfolio website with admin panel', 
 'Un sitio web de portafolio dinámico con panel de administración',
 'PHP, MySQL, JavaScript, Bootstrap', 1);
