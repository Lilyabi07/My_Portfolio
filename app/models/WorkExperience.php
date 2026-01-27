<?php
class WorkExperience {
    private $conn;
    private $table = 'work_experience';
    
    public $id;
    public $company_en;
    public $company_es;
    public $position_en;
    public $position_es;
    public $description_en;
    public $description_es;
    public $start_date;
    public $end_date;
    public $is_current;
    public $display_order;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function getAll() {
        $query = "SELECT * FROM " . $this->table . " ORDER BY display_order ASC, start_date DESC";
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
        $query = "INSERT INTO " . $this->table . " 
                  (company_en, company_es, position_en, position_es, description_en, description_es, 
                   start_date, end_date, is_current, display_order) 
                  VALUES (:company_en, :company_es, :position_en, :position_es, :description_en, :description_es,
                          :start_date, :end_date, :is_current, :display_order)";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':company_en', $this->company_en);
        $stmt->bindParam(':company_es', $this->company_es);
        $stmt->bindParam(':position_en', $this->position_en);
        $stmt->bindParam(':position_es', $this->position_es);
        $stmt->bindParam(':description_en', $this->description_en);
        $stmt->bindParam(':description_es', $this->description_es);
        $stmt->bindParam(':start_date', $this->start_date);
        $stmt->bindParam(':end_date', $this->end_date);
        $stmt->bindParam(':is_current', $this->is_current);
        $stmt->bindParam(':display_order', $this->display_order);
        
        return $stmt->execute();
    }
    
    public function update() {
        $query = "UPDATE " . $this->table . " 
                  SET company_en = :company_en, company_es = :company_es, position_en = :position_en,
                      position_es = :position_es, description_en = :description_en, description_es = :description_es,
                      start_date = :start_date, end_date = :end_date, is_current = :is_current,
                      display_order = :display_order
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':company_en', $this->company_en);
        $stmt->bindParam(':company_es', $this->company_es);
        $stmt->bindParam(':position_en', $this->position_en);
        $stmt->bindParam(':position_es', $this->position_es);
        $stmt->bindParam(':description_en', $this->description_en);
        $stmt->bindParam(':description_es', $this->description_es);
        $stmt->bindParam(':start_date', $this->start_date);
        $stmt->bindParam(':end_date', $this->end_date);
        $stmt->bindParam(':is_current', $this->is_current);
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
