<?php
class Skill {
    private $conn;
    private $table = 'skills';
    
    public $id;
    public $name_en;
    public $name_es;
    public $percentage;
    public $icon;
    public $display_order;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function getAll() {
        $query = "SELECT * FROM " . $this->table . " ORDER BY display_order ASC, id ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
    
    public function getById() {
        $query = "SELECT * FROM " . $this->table . " WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function create() {
        $query = "INSERT INTO " . $this->table . " (name_en, name_es, percentage, icon, display_order) 
                  VALUES (:name_en, :name_es, :percentage, :icon, :display_order)";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':name_en', $this->name_en);
        $stmt->bindParam(':name_es', $this->name_es);
        $stmt->bindParam(':percentage', $this->percentage);
        $stmt->bindParam(':icon', $this->icon);
        $stmt->bindParam(':display_order', $this->display_order);
        
        return $stmt->execute();
    }
    
    public function update() {
        $query = "UPDATE " . $this->table . " 
                  SET name_en = :name_en, name_es = :name_es, percentage = :percentage, 
                      icon = :icon, display_order = :display_order
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':name_en', $this->name_en);
        $stmt->bindParam(':name_es', $this->name_es);
        $stmt->bindParam(':percentage', $this->percentage);
        $stmt->bindParam(':icon', $this->icon);
        $stmt->bindParam(':display_order', $this->display_order);
        $stmt->bindParam(':id', $this->id);
        
        return $stmt->execute();
    }
    
    public function delete() {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->id);
        return $stmt->execute();
    }
}
?>
