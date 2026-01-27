# My Portfolio - Dynamic Portfolio Website

A fully responsive, dynamic portfolio website with an admin panel. Built using PHP following MVC architecture with bilingual support (English/Spanish).

**NEW:** Now also supports ASP.NET MVC backend with React frontend! See [ASP.NET + React Setup Guide](README_ASPNET_REACT.md) for details.

## Available Technology Stacks

### Option 1: PHP Stack (Original)
- **Backend:** PHP 7.4+ with PDO
- **Database:** MySQL
- **Frontend:** HTML5, CSS3, JavaScript, Bootstrap 5
- **Architecture:** MVC (Model-View-Controller)

### Option 2: ASP.NET + React Stack (New)
- **Backend:** ASP.NET Core 8.0 MVC
- **Database:** MySQL/SQL Server
- **Frontend:** React 18 with TypeScript
- **Architecture:** MVC + SPA

📖 **See [ASPNET_REACT_INTEGRATION.md](ASPNET_REACT_INTEGRATION.md) for complete integration details**

## Features

### Public Website
- ✅ Fully responsive design (mobile & desktop)
- ✅ Dynamic content from database
- ✅ Bilingual support (English/Spanish)
- ✅ Skills showcase with progress bars
- ✅ Projects portfolio with images
- ✅ Work experience timeline
- ✅ Modern, professional design with Bootstrap 5

### Admin Panel
- ✅ Secure login system with password hashing
- ✅ Dashboard with statistics
- ✅ Complete CRUD operations for:
  - Skills
  - Projects (with image upload)
  - Work Experience
- ✅ Bilingual content management
- ✅ Immediate reflection of changes on public website
- ✅ User-friendly interface

## Technology Stack

### PHP Stack (Original)

- **Backend:** PHP 7.4+ with PDO
- **Database:** MySQL
- **Frontend:** HTML5, CSS3, JavaScript
- **Framework:** Bootstrap 5
- **Icons:** Font Awesome 6
- **Architecture:** MVC (Model-View-Controller)

### ASP.NET + React Stack (New)

- **Backend:** ASP.NET Core 8.0 MVC
- **Database:** MySQL/SQL Server with Entity Framework
- **Frontend:** React 18 + TypeScript
- **Framework:** Bootstrap 5
- **Icons:** Font Awesome 6
- **Architecture:** MVC + SPA (Single Page Application)

For ASP.NET + React setup, see [README_ASPNET_REACT.md](README_ASPNET_REACT.md)

## Installation

### Prerequisites
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache/Nginx web server
- PHP extensions: PDO, PDO_MySQL

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Lilyabi07/My_Portfolio.git
   cd My_Portfolio
   ```

2. **Configure Database**
   - Create a MySQL database named `portfolio_db`
   - Update database credentials in `config/database.php`:
     ```php
     private $host = 'localhost';
     private $db_name = 'portfolio_db';
     private $username = 'your_username';
     private $password = 'your_password';
     ```

3. **Import Database Schema**
   ```bash
   mysql -u your_username -p portfolio_db < database.sql
   ```

4. **Set Permissions**
   ```bash
   chmod 777 public/uploads
   ```

5. **Configure Web Server**
   - Point your web server document root to the project directory
   - Ensure `index.php` is set as the directory index

6. **Access the Website**
   - Public site: `http://localhost/My_Portfolio/`
   - Admin panel: `http://localhost/My_Portfolio/admin/login.php`

## Default Admin Credentials

- **Username:** admin
- **Password:** admin123

⚠️ **Important:** Change the default password after first login!

## Directory Structure

```
My_Portfolio/
├── admin/                  # Admin panel
│   ├── includes/          # Auth check and includes
│   ├── index.php          # Admin dashboard
│   ├── login.php          # Admin login
│   ├── logout.php         # Logout handler
│   ├── skills.php         # Skills management
│   ├── projects.php       # Projects management
│   └── work_experience.php # Work experience management
├── app/
│   ├── models/            # Database models
│   │   ├── User.php
│   │   ├── Skill.php
│   │   ├── Project.php
│   │   └── WorkExperience.php
│   ├── controllers/       # Controllers (future use)
│   └── views/             # Views (future use)
├── config/
│   ├── config.php         # Application config
│   └── database.php       # Database connection
├── public/
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript files
│   └── uploads/          # Uploaded images
├── database.sql          # Database schema
├── index.php            # Public homepage
└── README.md            # This file
```

## Usage

### Admin Panel Features

1. **Login**
   - Navigate to `/admin/login.php`
   - Enter credentials
   - Access admin dashboard

2. **Manage Skills**
   - Add/Edit/Delete skills
   - Set skill name in both languages
   - Set proficiency percentage
   - Add Font Awesome icons
   - Control display order

3. **Manage Projects**
   - Add/Edit/Delete projects
   - Upload project images
   - Add project and GitHub URLs
   - Describe projects in both languages
   - List technologies used

4. **Manage Work Experience**
   - Add/Edit/Delete work experiences
   - Set company and position in both languages
   - Define date ranges
   - Mark current positions
   - Control display order

### Language Switching

- Click the globe icon in the navigation bar
- Switches between English (EN) and Spanish (ES)
- All content updates immediately

## Security Features

- Password hashing using PHP's `password_hash()`
- Session-based authentication
- SQL injection prevention with prepared statements
- XSS protection with `htmlspecialchars()`
- CSRF protection recommended for production

## Customization

### Adding New Sections
1. Create a new model in `app/models/`
2. Create database table with bilingual fields
3. Create admin CRUD page in `admin/`
4. Add section to `index.php`

### Styling
- Edit `public/css/style.css` for custom styles
- Modify color scheme in CSS variables

### Languages
- Add new language by:
  1. Adding language columns to database tables
  2. Updating labels in `index.php`
  3. Adding language option in navigation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

Created as a final project portfolio for the Comprehensive Assessment course.

## Support

For issues and questions, please open an issue in the GitHub repository.