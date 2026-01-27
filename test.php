<?php
/**
 * Database Connection Test
 * This file helps verify that your database connection is working correctly.
 * Delete this file after successful installation for security.
 */

require_once __DIR__ . '/config/config.php';

// Prevent access to this file in production
if (defined('PRODUCTION_MODE') && PRODUCTION_MODE === true) {
    die('Access denied. This file should be deleted in production.');
}

echo "<h1>Portfolio Database Connection Test</h1>";
echo "<hr>";

// Test 1: Check PHP version
echo "<h2>1. PHP Version Check</h2>";
$phpVersion = phpversion();
echo "PHP Version: <strong>$phpVersion</strong><br>";
if (version_compare($phpVersion, '7.4.0', '>=')) {
    echo "<span style='color: green;'>✓ PHP version is compatible (7.4+)</span><br>";
} else {
    echo "<span style='color: red;'>✗ PHP version is too old. Requires 7.4+</span><br>";
}
echo "<br>";

// Test 2: Check required extensions
echo "<h2>2. Required PHP Extensions</h2>";
$required_extensions = ['pdo', 'pdo_mysql', 'session'];
foreach ($required_extensions as $ext) {
    if (extension_loaded($ext)) {
        echo "<span style='color: green;'>✓ $ext is installed</span><br>";
    } else {
        echo "<span style='color: red;'>✗ $ext is NOT installed</span><br>";
    }
}
echo "<br>";

// Test 3: Check file permissions
echo "<h2>3. File Permissions</h2>";
$uploadDir = __DIR__ . '/public/uploads';
if (is_dir($uploadDir)) {
    if (is_writable($uploadDir)) {
        echo "<span style='color: green;'>✓ Upload directory is writable</span><br>";
    } else {
        echo "<span style='color: orange;'>⚠ Upload directory exists but is not writable</span><br>";
        echo "Run: chmod 755 public/uploads<br>";
    }
} else {
    echo "<span style='color: orange;'>⚠ Upload directory does not exist</span><br>";
    echo "Run: mkdir -p public/uploads && chmod 755 public/uploads<br>";
}
echo "<br>";

// Test 4: Database connection
echo "<h2>4. Database Connection Test</h2>";
try {
    require_once __DIR__ . '/config/database.php';
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db) {
        echo "<span style='color: green;'>✓ Database connection successful!</span><br>";
        
        // Test if tables exist
        echo "<br><h3>Database Tables:</h3>";
        $tables = ['users', 'skills', 'projects', 'work_experience', 'site_settings'];
        foreach ($tables as $table) {
            $stmt = $db->query("SHOW TABLES LIKE '$table'");
            if ($stmt->rowCount() > 0) {
                echo "<span style='color: green;'>✓ Table '$table' exists</span><br>";
            } else {
                echo "<span style='color: red;'>✗ Table '$table' does NOT exist</span><br>";
            }
        }
        
        // Check if admin user exists
        echo "<br><h3>Admin User:</h3>";
        $stmt = $db->query("SELECT COUNT(*) as count FROM users WHERE username = 'admin'");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($result['count'] > 0) {
            echo "<span style='color: green;'>✓ Admin user exists</span><br>";
            echo "Default credentials: admin / admin123<br>";
        } else {
            echo "<span style='color: red;'>✗ Admin user does NOT exist</span><br>";
            echo "Run the database.sql file to create tables and admin user<br>";
        }
        
    } else {
        echo "<span style='color: red;'>✗ Database connection failed</span><br>";
    }
} catch (Exception $e) {
    echo "<span style='color: red;'>✗ Database error: " . htmlspecialchars($e->getMessage()) . "</span><br>";
    echo "<br>";
    echo "<strong>Common solutions:</strong><br>";
    echo "1. Check database credentials in config/database.php<br>";
    echo "2. Ensure MySQL/MariaDB is running<br>";
    echo "3. Create the database: CREATE DATABASE portfolio_db;<br>";
    echo "4. Import database.sql: mysql -u username -p portfolio_db < database.sql<br>";
}
echo "<br>";

// Test 5: Config file check
echo "<h2>5. Configuration Files</h2>";
$configFiles = [
    'config/config.php' => 'Main configuration',
    'config/database.php' => 'Database configuration',
    'index.php' => 'Homepage',
    'admin/login.php' => 'Admin login',
];

foreach ($configFiles as $file => $desc) {
    if (file_exists(__DIR__ . '/' . $file)) {
        echo "<span style='color: green;'>✓ $desc ($file)</span><br>";
    } else {
        echo "<span style='color: red;'>✗ Missing: $desc ($file)</span><br>";
    }
}

echo "<br><hr>";
echo "<h2>Summary</h2>";
echo "<p>If all tests passed, your installation is ready!</p>";
echo "<p><strong>Next steps:</strong></p>";
echo "<ol>";
echo "<li>Delete this test.php file for security</li>";
echo "<li>Visit <a href='index.php'>the homepage</a></li>";
echo "<li>Login to <a href='admin/login.php'>admin panel</a></li>";
echo "<li>Change the default admin password</li>";
echo "</ol>";

echo "<style>
body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
h1, h2, h3 { color: #333; }
hr { margin: 20px 0; border: 1px solid #ddd; }
</style>";
?>
