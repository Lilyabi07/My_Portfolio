<?php
require_once __DIR__ . '/includes/auth_check.php';

// Destroy session and logout
session_destroy();
header('Location: login.php');
exit();
?>
