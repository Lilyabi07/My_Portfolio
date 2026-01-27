<?php
require_once __DIR__ . '/includes/auth_check.php';

$database = new Database();
$db = $database->getConnection();
$projectModel = new Project($db);

$error = '';
$success = '';
$action = $_GET['action'] ?? 'list';
$editId = $_GET['id'] ?? null;

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['action'])) {
        $projectModel->title_en = $_POST['title_en'] ?? '';
        $projectModel->title_es = $_POST['title_es'] ?? '';
        $projectModel->description_en = $_POST['description_en'] ?? '';
        $projectModel->description_es = $_POST['description_es'] ?? '';
        $projectModel->project_url = $_POST['project_url'] ?? '';
        $projectModel->github_url = $_POST['github_url'] ?? '';
        $projectModel->technologies = $_POST['technologies'] ?? '';
        $projectModel->display_order = $_POST['display_order'] ?? 0;
        
        // Handle image upload
        $imageName = $_POST['existing_image'] ?? '';
        if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
            $targetDir = __DIR__ . '/../public/uploads/';
            if (!file_exists($targetDir)) {
                mkdir($targetDir, 0777, true);
            }
            $imageName = time() . '_' . basename($_FILES['image']['name']);
            $targetFile = $targetDir . $imageName;
            move_uploaded_file($_FILES['image']['tmp_name'], $targetFile);
        }
        $projectModel->image = $imageName;
        
        if ($_POST['action'] == 'add') {
            if ($projectModel->create()) {
                $success = 'Project added successfully!';
                $action = 'list';
            } else {
                $error = 'Failed to add project.';
            }
        } elseif ($_POST['action'] == 'edit' && $_POST['id']) {
            $projectModel->id = $_POST['id'];
            if ($projectModel->update()) {
                $success = 'Project updated successfully!';
                $action = 'list';
            } else {
                $error = 'Failed to update project.';
            }
        }
    }
}

// Handle delete
if (isset($_GET['delete'])) {
    $projectModel->id = $_GET['delete'];
    if ($projectModel->delete()) {
        $success = 'Project deleted successfully!';
    } else {
        $error = 'Failed to delete project.';
    }
}

// Get project for editing
$editProject = null;
if ($action == 'edit' && $editId) {
    $projectModel->id = $editId;
    $editProject = $projectModel->getById();
}

// Get all projects
$projects = $projectModel->getAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Projects - Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../public/css/style.css">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="index.php">
                <i class="fas fa-user-shield"></i> Admin Dashboard
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="../index.php" target="_blank">
                            <i class="fas fa-eye"></i> View Site
                        </a>
                    </li>
                    <li class="nav-item">
                        <span class="nav-link">
                            <i class="fas fa-user"></i> <?php echo htmlspecialchars($_SESSION['admin_username']); ?>
                        </span>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="logout.php">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container-fluid mt-4">
        <div class="row">
            <!-- Sidebar -->
            <nav class="col-md-3 col-lg-2 d-md-block bg-light sidebar">
                <div class="position-sticky pt-3">
                    <ul class="nav flex-column">
                        <li class="nav-item">
                            <a class="nav-link" href="index.php">
                                <i class="fas fa-tachometer-alt"></i> Dashboard
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="skills.php">
                                <i class="fas fa-code"></i> Skills
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" href="projects.php">
                                <i class="fas fa-project-diagram"></i> Projects
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="work_experience.php">
                                <i class="fas fa-briefcase"></i> Work Experience
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

            <!-- Main Content -->
            <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 class="h2">Manage Projects</h1>
                    <?php if ($action == 'list'): ?>
                    <a href="?action=add" class="btn btn-primary">
                        <i class="fas fa-plus"></i> Add New Project
                    </a>
                    <?php else: ?>
                    <a href="projects.php" class="btn btn-secondary">
                        <i class="fas fa-arrow-left"></i> Back to List
                    </a>
                    <?php endif; ?>
                </div>

                <?php if ($error): ?>
                <div class="alert alert-danger alert-dismissible fade show">
                    <?php echo htmlspecialchars($error); ?>
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
                <?php endif; ?>

                <?php if ($success): ?>
                <div class="alert alert-success alert-dismissible fade show">
                    <?php echo htmlspecialchars($success); ?>
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
                <?php endif; ?>

                <?php if ($action == 'add' || $action == 'edit'): ?>
                <!-- Add/Edit Form -->
                <div class="card">
                    <div class="card-body">
                        <form method="POST" action="" enctype="multipart/form-data">
                            <input type="hidden" name="action" value="<?php echo $action; ?>">
                            <?php if ($action == 'edit' && $editProject): ?>
                            <input type="hidden" name="id" value="<?php echo $editProject['id']; ?>">
                            <input type="hidden" name="existing_image" value="<?php echo $editProject['image']; ?>">
                            <?php endif; ?>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="title_en" class="form-label">Project Title (English) *</label>
                                    <input type="text" class="form-control" id="title_en" name="title_en" 
                                           value="<?php echo $editProject['title_en'] ?? ''; ?>" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="title_es" class="form-label">Project Title (Spanish) *</label>
                                    <input type="text" class="form-control" id="title_es" name="title_es" 
                                           value="<?php echo $editProject['title_es'] ?? ''; ?>" required>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="description_en" class="form-label">Description (English) *</label>
                                    <textarea class="form-control" id="description_en" name="description_en" 
                                              rows="4" required><?php echo $editProject['description_en'] ?? ''; ?></textarea>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="description_es" class="form-label">Description (Spanish) *</label>
                                    <textarea class="form-control" id="description_es" name="description_es" 
                                              rows="4" required><?php echo $editProject['description_es'] ?? ''; ?></textarea>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="project_url" class="form-label">Project URL</label>
                                    <input type="url" class="form-control" id="project_url" name="project_url" 
                                           value="<?php echo $editProject['project_url'] ?? ''; ?>">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="github_url" class="form-label">GitHub URL</label>
                                    <input type="url" class="form-control" id="github_url" name="github_url" 
                                           value="<?php echo $editProject['github_url'] ?? ''; ?>">
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="technologies" class="form-label">Technologies</label>
                                    <input type="text" class="form-control" id="technologies" name="technologies" 
                                           value="<?php echo $editProject['technologies'] ?? ''; ?>" 
                                           placeholder="e.g., PHP, JavaScript, MySQL">
                                </div>
                                <div class="col-md-3 mb-3">
                                    <label for="display_order" class="form-label">Display Order</label>
                                    <input type="number" class="form-control" id="display_order" name="display_order" 
                                           value="<?php echo $editProject['display_order'] ?? '0'; ?>">
                                </div>
                                <div class="col-md-3 mb-3">
                                    <label for="image" class="form-label">Project Image</label>
                                    <input type="file" class="form-control" id="image" name="image" accept="image/*">
                                    <?php if ($editProject && $editProject['image']): ?>
                                    <small class="text-muted">Current: <?php echo $editProject['image']; ?></small>
                                    <?php endif; ?>
                                </div>
                            </div>

                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> <?php echo $action == 'add' ? 'Add' : 'Update'; ?> Project
                            </button>
                        </form>
                    </div>
                </div>
                <?php else: ?>
                <!-- List View -->
                <div class="card">
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Image</th>
                                        <th>Title (EN)</th>
                                        <th>Title (ES)</th>
                                        <th>Technologies</th>
                                        <th>Order</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php while ($project = $projects->fetch(PDO::FETCH_ASSOC)): ?>
                                    <tr>
                                        <td><?php echo $project['id']; ?></td>
                                        <td>
                                            <?php if ($project['image']): ?>
                                            <img src="../public/uploads/<?php echo htmlspecialchars($project['image']); ?>" 
                                                 alt="Project" style="width: 50px; height: 50px; object-fit: cover;">
                                            <?php endif; ?>
                                        </td>
                                        <td><?php echo htmlspecialchars($project['title_en']); ?></td>
                                        <td><?php echo htmlspecialchars($project['title_es']); ?></td>
                                        <td><?php echo htmlspecialchars($project['technologies']); ?></td>
                                        <td><?php echo $project['display_order']; ?></td>
                                        <td class="table-actions">
                                            <a href="?action=edit&id=<?php echo $project['id']; ?>" 
                                               class="btn btn-sm btn-warning">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                            <a href="?delete=<?php echo $project['id']; ?>" 
                                               class="btn btn-sm btn-danger" 
                                               onclick="return confirmDelete('Are you sure you want to delete this project?')">
                                                <i class="fas fa-trash"></i>
                                            </a>
                                        </td>
                                    </tr>
                                    <?php endwhile; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <?php endif; ?>
            </main>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../public/js/script.js"></script>
</body>
</html>
