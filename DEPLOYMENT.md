# Deployment Guide - Portfolio Website

This guide covers deploying the portfolio website to a production server.

## Pre-Deployment Checklist

Before deploying to production, ensure you have:

- [ ] Changed default admin password
- [ ] Updated database credentials
- [ ] Set `PRODUCTION_MODE` to `true` in `config/config.php`
- [ ] Configured environment variables for database
- [ ] Tested all features locally
- [ ] Created database backups
- [ ] Removed or secured test files (setup.php, test.php)

## Deployment Steps

### 1. Server Requirements

**Minimum Requirements:**
- PHP 7.4 or higher
- MySQL 5.7 or higher (or MariaDB 10.2+)
- Apache 2.4+ or Nginx 1.18+
- SSL certificate (recommended)
- At least 512MB RAM
- 500MB disk space

**Recommended:**
- PHP 8.0+
- MySQL 8.0+
- 1GB+ RAM
- SSD storage

### 2. Upload Files

#### Using FTP/SFTP:
```bash
# Upload all files except:
# - .git/
# - .env (create on server)
# - setup.php (delete after initial setup)
# - test.php (delete after testing)
```

#### Using Git:
```bash
# On your server
cd /var/www/html
git clone https://github.com/Lilyabi07/My_Portfolio.git
cd My_Portfolio
```

### 3. Configure Production Settings

#### a. Set Production Mode

Edit `config/config.php`:
```php
define('PRODUCTION_MODE', true); // Change to true
```

#### b. Configure Database

**Option 1: Environment Variables (Recommended)**

For Apache, add to your VirtualHost or .htaccess:
```apache
SetEnv DB_HOST "localhost"
SetEnv DB_NAME "portfolio_db"
SetEnv DB_USER "portfolio_user"
SetEnv DB_PASS "your_secure_password"
```

For Nginx with PHP-FPM, add to php-fpm pool config:
```nginx
env[DB_HOST] = localhost
env[DB_NAME] = portfolio_db
env[DB_USER] = portfolio_user
env[DB_PASS] = your_secure_password
```

**Option 2: Direct Configuration**

Edit `config/database.php` (less secure):
```php
private $host = 'localhost';
private $db_name = 'portfolio_db';
private $username = 'portfolio_user';
private $password = 'your_secure_password';
```

### 4. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Create database and user
CREATE DATABASE portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'portfolio_user'@'localhost' IDENTIFIED BY 'secure_password_here';
GRANT ALL PRIVILEGES ON portfolio_db.* TO 'portfolio_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import schema
mysql -u portfolio_user -p portfolio_db < database.sql
```

### 5. Set File Permissions

```bash
# Set proper ownership
sudo chown -R www-data:www-data /var/www/html/My_Portfolio

# Set directory permissions
find /var/www/html/My_Portfolio -type d -exec chmod 755 {} \;

# Set file permissions
find /var/www/html/My_Portfolio -type f -exec chmod 644 {} \;

# Make uploads directory writable
chmod 755 /var/www/html/My_Portfolio/public/uploads
```

### 6. Configure Web Server

#### Apache Configuration

Create VirtualHost file `/etc/apache2/sites-available/portfolio.conf`:

```apache
<VirtualHost *:80>
    ServerName yourwebsite.com
    ServerAlias www.yourwebsite.com
    
    DocumentRoot /var/www/html/My_Portfolio
    
    <Directory /var/www/html/My_Portfolio>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # Logs
    ErrorLog ${APACHE_LOG_DIR}/portfolio_error.log
    CustomLog ${APACHE_LOG_DIR}/portfolio_access.log combined
    
    # Environment variables
    SetEnv DB_HOST "localhost"
    SetEnv DB_NAME "portfolio_db"
    SetEnv DB_USER "portfolio_user"
    SetEnv DB_PASS "your_password"
</VirtualHost>

# SSL Configuration (Port 443)
<VirtualHost *:443>
    ServerName yourwebsite.com
    ServerAlias www.yourwebsite.com
    
    DocumentRoot /var/www/html/My_Portfolio
    
    SSLEngine on
    SSLCertificateFile /path/to/certificate.crt
    SSLCertificateKeyFile /path/to/private.key
    SSLCertificateChainFile /path/to/chain.crt
    
    <Directory /var/www/html/My_Portfolio>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/portfolio_ssl_error.log
    CustomLog ${APACHE_LOG_DIR}/portfolio_ssl_access.log combined
    
    # Environment variables
    SetEnv DB_HOST "localhost"
    SetEnv DB_NAME "portfolio_db"
    SetEnv DB_USER "portfolio_user"
    SetEnv DB_PASS "your_password"
</VirtualHost>
```

Enable site and modules:
```bash
sudo a2ensite portfolio
sudo a2enmod rewrite ssl
sudo systemctl restart apache2
```

#### Nginx Configuration

Create `/etc/nginx/sites-available/portfolio`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourwebsite.com www.yourwebsite.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourwebsite.com www.yourwebsite.com;
    
    root /var/www/html/My_Portfolio;
    index index.php index.html;
    
    # SSL Configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # Logs
    access_log /var/log/nginx/portfolio_access.log;
    error_log /var/log/nginx/portfolio_error.log;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
    
    # Deny access to sensitive files
    location ~ /\. {
        deny all;
    }
    
    location ~ ^/(config|database\.sql|setup\.php|test\.php) {
        deny all;
    }
    
    # Cache static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. SSL Certificate

#### Using Let's Encrypt (Free):

```bash
# Install Certbot
sudo apt install certbot python3-certbot-apache  # For Apache
# or
sudo apt install certbot python3-certbot-nginx   # For Nginx

# Get certificate
sudo certbot --apache -d yourwebsite.com -d www.yourwebsite.com  # Apache
# or
sudo certbot --nginx -d yourwebsite.com -d www.yourwebsite.com   # Nginx

# Auto-renewal
sudo certbot renew --dry-run
```

### 8. Security Hardening

#### a. PHP Security Settings

Edit `/etc/php/7.4/apache2/php.ini` or `/etc/php/7.4/fpm/php.ini`:

```ini
expose_php = Off
display_errors = Off
log_errors = On
error_log = /var/log/php_errors.log

session.cookie_httponly = 1
session.cookie_secure = 1
session.use_only_cookies = 1

upload_max_filesize = 5M
post_max_size = 5M
max_execution_time = 30
memory_limit = 128M

disable_functions = exec,passthru,shell_exec,system,proc_open,popen,curl_exec,curl_multi_exec,parse_ini_file,show_source
```

#### b. Firewall Configuration

```bash
# UFW (Ubuntu)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable

# Fail2ban for brute force protection
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

#### c. Disable Directory Listing

Already handled in `.htaccess` and Nginx config.

#### d. Protect Config Files

```bash
# Move config outside web root (advanced)
sudo mkdir /var/www/config
sudo mv /var/www/html/My_Portfolio/config/* /var/www/config/
# Update paths in files accordingly
```

### 9. Post-Deployment Tasks

#### a. Delete Sensitive Files

```bash
rm setup.php test.php
```

#### b. Change Admin Password

1. Login to admin panel
2. Create a new admin user with strong password
3. Delete default admin user (optional)

#### c. Database Backup

```bash
# Manual backup
mysqldump -u portfolio_user -p portfolio_db > backup_$(date +%Y%m%d).sql

# Automated daily backup (crontab)
0 2 * * * mysqldump -u portfolio_user -pYOUR_PASSWORD portfolio_db | gzip > /backups/portfolio_$(date +\%Y\%m\%d).sql.gz
```

#### d. Setup Monitoring

Consider using:
- Google Analytics for traffic
- UptimeRobot for uptime monitoring
- Cloudflare for CDN and DDoS protection

### 10. Testing Production Site

- [ ] Visit homepage and verify content loads
- [ ] Test language switching
- [ ] Login to admin panel
- [ ] Add/Edit/Delete a skill, project, and work experience
- [ ] Verify changes appear on public site immediately
- [ ] Upload an image for a project
- [ ] Test on mobile devices
- [ ] Check SSL certificate
- [ ] Verify all links work
- [ ] Test form submissions

## Troubleshooting

### Issue: 500 Internal Server Error

**Solution:**
- Check error logs: `tail -f /var/log/apache2/error.log`
- Verify file permissions
- Check PHP error log
- Ensure database connection is correct

### Issue: Database Connection Failed

**Solution:**
- Verify database credentials
- Check if MySQL is running: `sudo systemctl status mysql`
- Verify user has proper permissions: `SHOW GRANTS FOR 'portfolio_user'@'localhost';`

### Issue: Images Not Uploading

**Solution:**
- Check `public/uploads` is writable: `ls -la public/uploads`
- Verify PHP upload settings in php.ini
- Check disk space: `df -h`

### Issue: Session Problems

**Solution:**
- Check session directory: `ls -la /var/lib/php/sessions`
- Ensure PHP session settings are correct
- Clear browser cookies

## Maintenance

### Regular Tasks

**Daily:**
- Monitor error logs
- Check disk space

**Weekly:**
- Review admin activity
- Check for failed login attempts
- Update content

**Monthly:**
- Update PHP and system packages
- Review and rotate logs
- Test backups

**Quarterly:**
- Security audit
- Performance optimization
- Review analytics

### Updates

```bash
# Pull latest changes from Git
cd /var/www/html/My_Portfolio
git pull origin main

# Apply database migrations if any
mysql -u portfolio_user -p portfolio_db < migrations/new_migration.sql

# Clear any caches
# Restart PHP-FPM if needed
sudo systemctl restart php7.4-fpm
```

## Performance Optimization

### Enable Caching

1. **Browser Caching:** Already configured in .htaccess
2. **OPcache:** Enable in php.ini
3. **Database Query Caching:** Enable in MySQL config

### CDN Setup

1. Sign up for Cloudflare (free)
2. Point DNS to Cloudflare
3. Enable caching and minification
4. Use Cloudflare's free SSL

### Image Optimization

```bash
# Install optimization tools
sudo apt install optipng jpegoptim

# Optimize images
find public/uploads -name "*.png" -exec optipng {} \;
find public/uploads -name "*.jpg" -exec jpegoptim --max=85 {} \;
```

## Support

For deployment issues:
1. Check this guide thoroughly
2. Review server error logs
3. Consult hosting provider documentation
4. Open an issue on GitHub

## Rollback Procedure

If deployment fails:

```bash
# Restore from backup
mysql -u portfolio_user -p portfolio_db < backup_YYYYMMDD.sql

# Revert code
git checkout previous_working_commit

# Restart services
sudo systemctl restart apache2  # or nginx
```
