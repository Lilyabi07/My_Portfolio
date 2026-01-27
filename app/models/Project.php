<?php
class Project {
    private $conn;
    private $table = 'projects';
    
    public $id;
    public $title_en;
    public $title_es;
    public $description_en;
    public $description_es;
    public $image;
    public $project_url;
    public $github_url;
    public $technologies;
    public $display_order;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    public function getAll() {
        $query = "SELECT * FROM " . $this->table . " ORDER BY display_order ASC, id DESC";
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
                  (title_en, title_es, description_en, description_es, image, project_url, github_url, technologies, display_order) 
                  VALUES (:title_en, :title_es, :description_en, :description_es, :image, :project_url, :github_url, :technologies, :display_order)";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':title_en', $this->title_en);
        $stmt->bindParam(':title_es', $this->title_es);
        $stmt->bindParam(':description_en', $this->description_en);
        $stmt->bindParam(':description_es', $this->description_es);
        $stmt->bindParam(':image', $this->image);
        $stmt->bindParam(':project_url', $this->project_url);
        $stmt->bindParam(':github_url', $this->github_url);
        $stmt->bindParam(':technologies', $this->technologies);
        $stmt->bindParam(':display_order', $this->display_order);
        
        return $stmt->execute();
    }
    
    public function update() {
        $query = "UPDATE " . $this->table . " 
                  SET title_en = :title_en, title_es = :title_es, description_en = :description_en, 
                      description_es = :description_es, image = :image, project_url = :project_url,
                      github_url = :github_url, technologies = :technologies, display_order = :display_order
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(':title_en', $this->title_en);
        $stmt->bindParam(':title_es', $this->title_es);
        $stmt->bindParam(':description_en', $this->description_en);
        $stmt->bindParam(':description_es', $this->description_es);
        $stmt->bindParam(':image', $this->image);
        $stmt->bindParam(':project_url', $this->project_url);
        $stmt->bindParam(':github_url', $this->github_url);
        $stmt->bindParam(':technologies', $this->technologies);
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
