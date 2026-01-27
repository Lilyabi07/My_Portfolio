<?php
require_once __DIR__ . '/includes/auth_check.php';

$database = new Database();
$db = $database->getConnection();
$skillModel = new Skill($db);

$error = '';
$success = '';
$action = $_GET['action'] ?? 'list';
$editId = $_GET['id'] ?? null;

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['action'])) {
        $skillModel->name_en = $_POST['name_en'] ?? '';
        $skillModel->name_es = $_POST['name_es'] ?? '';
        $skillModel->percentage = $_POST['percentage'] ?? 0;
        $skillModel->icon = $_POST['icon'] ?? '';
        $skillModel->display_order = $_POST['display_order'] ?? 0;
        
        if ($_POST['action'] == 'add') {
            if ($skillModel->create()) {
                $success = 'Skill added successfully!';
                $action = 'list';
            } else {
                $error = 'Failed to add skill.';
            }
        } elseif ($_POST['action'] == 'edit' && $_POST['id']) {
            $skillModel->id = $_POST['id'];
            if ($skillModel->update()) {
                $success = 'Skill updated successfully!';
                $action = 'list';
            } else {
                $error = 'Failed to update skill.';
            }
        }
    }
}

// Handle delete
if (isset($_GET['delete'])) {
    $skillModel->id = $_GET['delete'];
    if ($skillModel->delete()) {
        $success = 'Skill deleted successfully!';
    } else {
        $error = 'Failed to delete skill.';
    }
}

// Get skill for editing
$editSkill = null;
if ($action == 'edit' && $editId) {
    $skillModel->id = $editId;
    $editSkill = $skillModel->getById();
}

// Get all skills
$skills = $skillModel->getAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Skills - Admin</title>
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
                            <a class="nav-link active" href="skills.php">
                                <i class="fas fa-code"></i> Skills
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="projects.php">
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
                    <h1 class="h2">Manage Skills</h1>
                    <?php if ($action == 'list'): ?>
                    <a href="?action=add" class="btn btn-primary">
                        <i class="fas fa-plus"></i> Add New Skill
                    </a>
                    <?php else: ?>
                    <a href="skills.php" class="btn btn-secondary">
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
                        <form method="POST" action="">
                            <input type="hidden" name="action" value="<?php echo $action; ?>">
                            <?php if ($action == 'edit' && $editSkill): ?>
                            <input type="hidden" name="id" value="<?php echo $editSkill['id']; ?>">
                            <?php endif; ?>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="name_en" class="form-label">Skill Name (English) *</label>
                                    <input type="text" class="form-control" id="name_en" name="name_en" 
                                           value="<?php echo $editSkill['name_en'] ?? ''; ?>" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="name_es" class="form-label">Skill Name (Spanish) *</label>
                                    <input type="text" class="form-control" id="name_es" name="name_es" 
                                           value="<?php echo $editSkill['name_es'] ?? ''; ?>" required>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <label for="percentage" class="form-label">Proficiency (%) *</label>
                                    <input type="number" class="form-control" id="percentage" name="percentage" 
                                           min="0" max="100" value="<?php echo $editSkill['percentage'] ?? '0'; ?>" required>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label for="icon" class="form-label">Icon Class (Font Awesome)</label>
                                    <input type="text" class="form-control" id="icon" name="icon" 
                                           value="<?php echo $editSkill['icon'] ?? ''; ?>" 
                                           placeholder="e.g., fas fa-code">
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label for="display_order" class="form-label">Display Order</label>
                                    <input type="number" class="form-control" id="display_order" name="display_order" 
                                           value="<?php echo $editSkill['display_order'] ?? '0'; ?>">
                                </div>
                            </div>

                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> <?php echo $action == 'add' ? 'Add' : 'Update'; ?> Skill
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
                                        <th>Icon</th>
                                        <th>Name (EN)</th>
                                        <th>Name (ES)</th>
                                        <th>Proficiency</th>
                                        <th>Order</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php while ($skill = $skills->fetch(PDO::FETCH_ASSOC)): ?>
                                    <tr>
                                        <td><?php echo $skill['id']; ?></td>
                                        <td>
                                            <?php if ($skill['icon']): ?>
                                            <i class="<?php echo htmlspecialchars($skill['icon']); ?>"></i>
                                            <?php endif; ?>
                                        </td>
                                        <td><?php echo htmlspecialchars($skill['name_en']); ?></td>
                                        <td><?php echo htmlspecialchars($skill['name_es']); ?></td>
                                        <td>
                                            <div class="progress" style="width: 100px;">
                                                <div class="progress-bar" role="progressbar" 
                                                     style="width: <?php echo $skill['percentage']; ?>%">
                                                    <?php echo $skill['percentage']; ?>%
                                                </div>
                                            </div>
                                        </td>
                                        <td><?php echo $skill['display_order']; ?></td>
                                        <td class="table-actions">
                                            <a href="?action=edit&id=<?php echo $skill['id']; ?>" 
                                               class="btn btn-sm btn-warning">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                            <a href="?delete=<?php echo $skill['id']; ?>" 
                                               class="btn btn-sm btn-danger" 
                                               onclick="return confirmDelete('Are you sure you want to delete this skill?')">
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
