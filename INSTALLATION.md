# Portfolio Website - Installation Guide

This guide will help you set up the dynamic portfolio website on your local machine or server.

## Prerequisites

Before you begin, ensure you have:

- **PHP 7.4 or higher** installed
- **MySQL 5.7 or higher** installed
- **Apache or Nginx** web server
- **Composer** (optional, for future dependencies)
- A text editor or IDE

## Step-by-Step Installation

### 1. Download the Project

Clone or download the repository to your web server's document root:

```bash
git clone https://github.com/Lilyabi07/My_Portfolio.git
cd My_Portfolio
```

### 2. Database Setup

#### Option A: Using Command Line

```bash
# Login to MySQL
mysql -u root -p

# Create database and user (replace 'your_password' with a secure password)
CREATE DATABASE portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'portfolio_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON portfolio_db.* TO 'portfolio_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import the database schema
mysql -u portfolio_user -p portfolio_db < database.sql
```

#### Option B: Using phpMyAdmin

1. Open phpMyAdmin in your browser
2. Create a new database named `portfolio_db`
3. Select the database
4. Go to "Import" tab
5. Choose the `database.sql` file
6. Click "Go" to import

### 3. Configure Database Connection

Edit `config/database.php` and update the database credentials:

```php
private $host = 'localhost';           // Usually 'localhost'
private $db_name = 'portfolio_db';     // Database name
private $username = 'portfolio_user';  // Your MySQL username
private $password = 'your_password';   // Your MySQL password
```

### 4. Set File Permissions

Make sure the uploads directory is writable:

```bash
chmod 755 public/uploads
```

For Linux/Mac users:
```bash
sudo chown -R www-data:www-data public/uploads
```

### 5. Web Server Configuration

#### Apache (.htaccess)

If not already present, create `.htaccess` in the root directory:

```apache
# Enable URL rewriting (optional)
# RewriteEngine On
# RewriteCond %{REQUEST_FILENAME} !-f
# RewriteCond %{REQUEST_FILENAME} !-d
# RewriteRule ^(.*)$ index.php/$1 [L]

# Disable directory listing
Options -Indexes

# Set default charset
AddDefaultCharset UTF-8

# Compress output
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

#### Nginx

Add this to your Nginx server block:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/My_Portfolio;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### 6. Access the Website

Open your browser and navigate to:

- **Public Website:** `http://localhost/My_Portfolio/`
- **Admin Panel:** `http://localhost/My_Portfolio/admin/login.php`

## Default Login Credentials

Use these credentials to login to the admin panel:

- **Username:** admin
- **Password:** admin123

⚠️ **IMPORTANT:** Change the default password immediately after first login!

## Troubleshooting

### Common Issues

#### 1. Database Connection Error

**Problem:** "Connection error: ..."

**Solution:**
- Verify database credentials in `config/database.php`
- Ensure MySQL service is running: `sudo service mysql start`
- Check if database exists: `SHOW DATABASES;` in MySQL

#### 2. Page Not Found (404)

**Problem:** Admin pages show 404 error

**Solution:**
- Ensure all files are uploaded correctly
- Check file permissions
- Verify web server configuration

#### 3. Cannot Upload Images

**Problem:** Image upload fails

**Solution:**
- Check `public/uploads` directory exists and is writable
- Verify PHP `upload_max_filesize` in php.ini (should be at least 5MB)
- Check `post_max_size` in php.ini

#### 4. Session Issues

**Problem:** Cannot stay logged in

**Solution:**
- Ensure PHP sessions are enabled
- Check session directory is writable: `ls -la /var/lib/php/sessions`
- Verify session settings in php.ini

#### 5. Styling Not Loading

**Problem:** Website appears without styles

**Solution:**
- Check browser console for errors
- Verify file paths are correct
- Clear browser cache
- Check internet connection (for CDN resources)

### PHP Configuration

Recommended PHP settings in `php.ini`:

```ini
max_execution_time = 300
memory_limit = 256M
post_max_size = 20M
upload_max_filesize = 20M
session.save_path = "/var/lib/php/sessions"
```

After changing php.ini, restart your web server:
```bash
sudo service apache2 restart
# or
sudo service nginx restart
sudo service php7.4-fpm restart
```

## Security Recommendations

### For Production Deployment

1. **Change Default Credentials**
   - Update admin password immediately
   - Use strong passwords (12+ characters, mixed case, numbers, symbols)

2. **Update Database Configuration**
   - Use different database credentials
   - Restrict database user permissions
   - Don't use 'root' user

3. **File Permissions**
   ```bash
   # Set proper permissions
   find . -type d -exec chmod 755 {} \;
   find . -type f -exec chmod 644 {} \;
   chmod 755 public/uploads
   ```

4. **SSL/HTTPS**
   - Install SSL certificate
   - Force HTTPS in .htaccess:
   ```apache
   RewriteEngine On
   RewriteCond %{HTTPS} off
   RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
   ```

5. **Hide Sensitive Files**
   - Move `config/` directory outside web root
   - Add `.htaccess` to protect config directory:
   ```apache
   Deny from all
   ```

6. **Error Reporting**
   - Disable error display in production:
   ```php
   // In config/config.php
   ini_set('display_errors', 0);
   error_reporting(0);
   ```

7. **Database Backups**
   - Set up automated backups
   - Use cron job:
   ```bash
   0 2 * * * mysqldump -u portfolio_user -p'password' portfolio_db > /backups/portfolio_$(date +\%Y\%m\%d).sql
   ```

## Next Steps

After installation:

1. Login to admin panel
2. Change default password
3. Update Skills, Projects, and Work Experience with your data
4. Upload project images
5. Customize colors and styling in `public/css/style.css`
6. Test language switching
7. Test on mobile devices

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review error logs: `/var/log/apache2/error.log` or `/var/log/nginx/error.log`
3. Open an issue on GitHub with:
   - Error message
   - Steps to reproduce
   - PHP version
   - MySQL version
   - Operating system

## Additional Resources

- [PHP Documentation](https://www.php.net/docs.php)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Bootstrap Documentation](https://getbootstrap.com/docs/)
- [Font Awesome Icons](https://fontawesome.com/icons)
