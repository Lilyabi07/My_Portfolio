<?php
class Database {
    // Use environment variables if available, otherwise use defaults
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $conn;
    
    public function __construct() {
        // Load from environment variables or use defaults
        $this->host = getenv('DB_HOST') ?: 'localhost';
        $this->db_name = getenv('DB_NAME') ?: 'portfolio_db';
        $this->username = getenv('DB_USER') ?: 'root';
        $this->password = getenv('DB_PASS') ?: '';
    }
    
    public function getConnection() {
        $this->conn = null;
        
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception) {
            if (defined('PRODUCTION_MODE') && PRODUCTION_MODE) {
                error_log("Database connection error: " . $exception->getMessage());
                die("Database connection failed. Please contact support.");
            } else {
                echo "Connection error: " . $exception->getMessage();
            }
        }
        
        return $this->conn;
    }
}
?>
