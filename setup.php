<?php
// Security headers
header("X-Frame-Options: SAMEORIGIN");
header("X-XSS-Protection: 1; mode=block");
header("X-Content-Type-Options: nosniff");
header("Referrer-Policy: strict-origin-when-cross-origin");

// Prevent access to this file in production
// Comment this out during development
// if ($_SERVER['REMOTE_ADDR'] !== '127.0.0.1' && $_SERVER['REMOTE_ADDR'] !== '::1') {
//     die('Access denied');
// }

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';

$errors = [];
$warnings = [];
$successes = [];

// Check PHP version
if (version_compare(phpversion(), '7.4.0', '>=')) {
    $successes[] = "PHP version " . phpversion() . " is compatible";
} else {
    $errors[] = "PHP version " . phpversion() . " is too old. Requires 7.4 or higher";
}

// Check required extensions
$required = ['pdo', 'pdo_mysql', 'session', 'json', 'mbstring'];
foreach ($required as $ext) {
    if (extension_loaded($ext)) {
        $successes[] = "PHP extension '$ext' is loaded";
    } else {
        $errors[] = "Required PHP extension '$ext' is NOT loaded";
    }
}

// Check directories
$dirs = [
    'config' => __DIR__ . '/config',
    'app/models' => __DIR__ . '/app/models',
    'admin' => __DIR__ . '/admin',
    'public/uploads' => __DIR__ . '/public/uploads',
    'public/css' => __DIR__ . '/public/css',
    'public/js' => __DIR__ . '/public/js',
];

foreach ($dirs as $name => $path) {
    if (is_dir($path)) {
        $successes[] = "Directory '$name' exists";
        
        // Check if writable for upload directory
        if ($name === 'public/uploads') {
            if (is_writable($path)) {
                $successes[] = "Upload directory is writable";
            } else {
                $warnings[] = "Upload directory exists but is not writable. Run: chmod 755 public/uploads";
            }
        }
    } else {
        $errors[] = "Directory '$name' is missing";
    }
}

// Test database connection
try {
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db) {
        $successes[] = "Database connection successful";
        
        // Check tables
        $tables = ['users', 'skills', 'projects', 'work_experience'];
        foreach ($tables as $table) {
            try {
                $stmt = $db->query("SELECT COUNT(*) FROM $table");
                $count = $stmt->fetchColumn();
                $successes[] = "Table '$table' exists with $count record(s)";
            } catch (PDOException $e) {
                $errors[] = "Table '$table' does not exist or cannot be accessed";
            }
        }
        
        // Check admin user
        try {
            $stmt = $db->query("SELECT COUNT(*) FROM users WHERE username = 'admin'");
            if ($stmt->fetchColumn() > 0) {
                $successes[] = "Admin user exists";
            } else {
                $warnings[] = "Admin user does not exist. Import database.sql";
            }
        } catch (PDOException $e) {
            $errors[] = "Cannot check for admin user";
        }
    } else {
        $errors[] = "Database connection failed";
    }
} catch (Exception $e) {
    $errors[] = "Database error: " . $e->getMessage();
    $warnings[] = "Check config/database.php credentials and ensure MySQL is running";
}

// Check critical files
$files = [
    'index.php',
    'database.sql',
    'config/config.php',
    'config/database.php',
    'admin/login.php',
    'admin/index.php',
];

foreach ($files as $file) {
    if (file_exists(__DIR__ . '/' . $file)) {
        $successes[] = "File '$file' exists";
    } else {
        $errors[] = "Critical file '$file' is missing";
    }
}

// Security checks
if (ini_get('display_errors')) {
    $warnings[] = "display_errors is ON. Should be OFF in production";
}

if (ini_get('expose_php')) {
    $warnings[] = "expose_php is ON. Should be OFF in production";
}

$uploadMaxSize = ini_get('upload_max_filesize');
$postMaxSize = ini_get('post_max_size');
if (intval($uploadMaxSize) < 5) {
    $warnings[] = "upload_max_filesize is $uploadMaxSize. Consider increasing to at least 5M";
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Setup Verification - My Portfolio</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body {
            padding: 20px;
            background: #f8f9fa;
        }
        .setup-container {
            max-width: 900px;
            margin: 0 auto;
        }
        .check-item {
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .check-item:last-child {
            border-bottom: none;
        }
    </style>
</head>
<body>
    <div class="setup-container">
        <div class="card shadow-lg">
            <div class="card-header bg-primary text-white">
                <h1 class="h3 mb-0">
                    <i class="fas fa-check-circle"></i> Portfolio Setup Verification
                </h1>
            </div>
            <div class="card-body">
                
                <?php if (!empty($errors)): ?>
                <div class="alert alert-danger">
                    <h5><i class="fas fa-times-circle"></i> Errors (<?php echo count($errors); ?>)</h5>
                    <hr>
                    <?php foreach ($errors as $error): ?>
                    <div class="check-item">
                        <i class="fas fa-times text-danger"></i> <?php echo htmlspecialchars($error); ?>
                    </div>
                    <?php endforeach; ?>
                </div>
                <?php endif; ?>
                
                <?php if (!empty($warnings)): ?>
                <div class="alert alert-warning">
                    <h5><i class="fas fa-exclamation-triangle"></i> Warnings (<?php echo count($warnings); ?>)</h5>
                    <hr>
                    <?php foreach ($warnings as $warning): ?>
                    <div class="check-item">
                        <i class="fas fa-exclamation text-warning"></i> <?php echo htmlspecialchars($warning); ?>
                    </div>
                    <?php endforeach; ?>
                </div>
                <?php endif; ?>
                
                <?php if (!empty($successes)): ?>
                <div class="alert alert-success">
                    <h5><i class="fas fa-check-circle"></i> Success (<?php echo count($successes); ?>)</h5>
                    <hr>
                    <?php foreach ($successes as $success): ?>
                    <div class="check-item">
                        <i class="fas fa-check text-success"></i> <?php echo htmlspecialchars($success); ?>
                    </div>
                    <?php endforeach; ?>
                </div>
                <?php endif; ?>
                
            </div>
            <div class="card-footer">
                <h5>Summary</h5>
                <p class="mb-2">
                    <span class="badge bg-success"><?php echo count($successes); ?> Passed</span>
                    <span class="badge bg-warning text-dark"><?php echo count($warnings); ?> Warnings</span>
                    <span class="badge bg-danger"><?php echo count($errors); ?> Errors</span>
                </p>
                
                <?php if (empty($errors)): ?>
                <div class="alert alert-success mb-0">
                    <h5><i class="fas fa-thumbs-up"></i> Setup Complete!</h5>
                    <p>Your installation is ready. Next steps:</p>
                    <ol class="mb-0">
                        <li><strong>Delete</strong> this setup.php and test.php file for security</li>
                        <li>Visit <a href="index.php" class="alert-link">the homepage</a></li>
                        <li>Login to <a href="admin/login.php" class="alert-link">admin panel</a> (admin/admin123)</li>
                        <li>Change the default admin password immediately</li>
                        <li>Start adding your content!</li>
                    </ol>
                </div>
                <?php else: ?>
                <div class="alert alert-danger mb-0">
                    <h5><i class="fas fa-wrench"></i> Action Required</h5>
                    <p>Please fix the errors above before proceeding. Common solutions:</p>
                    <ul class="mb-0">
                        <li>Check database credentials in <code>config/database.php</code></li>
                        <li>Import database: <code>mysql -u user -p portfolio_db &lt; database.sql</code></li>
                        <li>Set permissions: <code>chmod 755 public/uploads</code></li>
                        <li>Install missing PHP extensions</li>
                    </ul>
                </div>
                <?php endif; ?>
                
                <div class="mt-3">
                    <a href="setup.php" class="btn btn-primary">
                        <i class="fas fa-redo"></i> Re-check
                    </a>
                    <a href="INSTALLATION.md" class="btn btn-secondary">
                        <i class="fas fa-book"></i> Installation Guide
                    </a>
                </div>
            </div>
        </div>
        
        <div class="text-center mt-3 text-muted">
            <small>Portfolio Setup Verification v1.0</small>
        </div>
    </div>
</body>
</html>
