<?php
require_once __DIR__ . '/includes/auth_check.php';

$database = new Database();
$db = $database->getConnection();
$workExpModel = new WorkExperience($db);

$error = '';
$success = '';
$action = $_GET['action'] ?? 'list';
$editId = $_GET['id'] ?? null;

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['action'])) {
        $workExpModel->company_en = $_POST['company_en'] ?? '';
        $workExpModel->company_es = $_POST['company_es'] ?? '';
        $workExpModel->position_en = $_POST['position_en'] ?? '';
        $workExpModel->position_es = $_POST['position_es'] ?? '';
        $workExpModel->description_en = $_POST['description_en'] ?? '';
        $workExpModel->description_es = $_POST['description_es'] ?? '';
        $workExpModel->start_date = $_POST['start_date'] ?? '';
        $workExpModel->end_date = $_POST['end_date'] ?? null;
        $workExpModel->is_current = isset($_POST['is_current']) ? 1 : 0;
        $workExpModel->display_order = $_POST['display_order'] ?? 0;
        
        if ($_POST['action'] == 'add') {
            if ($workExpModel->create()) {
                $success = 'Work experience added successfully!';
                $action = 'list';
            } else {
                $error = 'Failed to add work experience.';
            }
        } elseif ($_POST['action'] == 'edit' && $_POST['id']) {
            $workExpModel->id = $_POST['id'];
            if ($workExpModel->update()) {
                $success = 'Work experience updated successfully!';
                $action = 'list';
            } else {
                $error = 'Failed to update work experience.';
            }
        }
    }
}

// Handle delete
if (isset($_GET['delete'])) {
    $workExpModel->id = $_GET['delete'];
    if ($workExpModel->delete()) {
        $success = 'Work experience deleted successfully!';
    } else {
        $error = 'Failed to delete work experience.';
    }
}

// Get work experience for editing
$editWorkExp = null;
if ($action == 'edit' && $editId) {
    $workExpModel->id = $editId;
    $editWorkExp = $workExpModel->getById();
}

// Get all work experiences
$workExperiences = $workExpModel->getAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Work Experience - Admin</title>
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
                            <a class="nav-link" href="projects.php">
                                <i class="fas fa-project-diagram"></i> Projects
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" href="work_experience.php">
                                <i class="fas fa-briefcase"></i> Work Experience
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

            <!-- Main Content -->
            <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 class="h2">Manage Work Experience</h1>
                    <?php if ($action == 'list'): ?>
                    <a href="?action=add" class="btn btn-primary">
                        <i class="fas fa-plus"></i> Add Work Experience
                    </a>
                    <?php else: ?>
                    <a href="work_experience.php" class="btn btn-secondary">
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
                            <?php if ($action == 'edit' && $editWorkExp): ?>
                            <input type="hidden" name="id" value="<?php echo $editWorkExp['id']; ?>">
                            <?php endif; ?>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="company_en" class="form-label">Company (English) *</label>
                                    <input type="text" class="form-control" id="company_en" name="company_en" 
                                           value="<?php echo $editWorkExp['company_en'] ?? ''; ?>" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="company_es" class="form-label">Company (Spanish) *</label>
                                    <input type="text" class="form-control" id="company_es" name="company_es" 
                                           value="<?php echo $editWorkExp['company_es'] ?? ''; ?>" required>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="position_en" class="form-label">Position (English) *</label>
                                    <input type="text" class="form-control" id="position_en" name="position_en" 
                                           value="<?php echo $editWorkExp['position_en'] ?? ''; ?>" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="position_es" class="form-label">Position (Spanish) *</label>
                                    <input type="text" class="form-control" id="position_es" name="position_es" 
                                           value="<?php echo $editWorkExp['position_es'] ?? ''; ?>" required>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="description_en" class="form-label">Description (English) *</label>
                                    <textarea class="form-control" id="description_en" name="description_en" 
                                              rows="4" required><?php echo $editWorkExp['description_en'] ?? ''; ?></textarea>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="description_es" class="form-label">Description (Spanish) *</label>
                                    <textarea class="form-control" id="description_es" name="description_es" 
                                              rows="4" required><?php echo $editWorkExp['description_es'] ?? ''; ?></textarea>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-3 mb-3">
                                    <label for="start_date" class="form-label">Start Date *</label>
                                    <input type="date" class="form-control" id="start_date" name="start_date" 
                                           value="<?php echo $editWorkExp['start_date'] ?? ''; ?>" required>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <label for="end_date" class="form-label">End Date</label>
                                    <input type="date" class="form-control" id="end_date" name="end_date" 
                                           value="<?php echo $editWorkExp['end_date'] ?? ''; ?>"
                                           <?php echo ($editWorkExp && $editWorkExp['is_current']) ? 'disabled' : ''; ?>>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <label for="is_current" class="form-label">Current Position</label>
                                    <div class="form-check mt-2">
                                        <input type="checkbox" class="form-check-input" id="is_current" name="is_current" 
                                               <?php echo ($editWorkExp && $editWorkExp['is_current']) ? 'checked' : ''; ?>
                                               onchange="document.getElementById('end_date').disabled = this.checked; if(this.checked) document.getElementById('end_date').value = '';">
                                        <label class="form-check-label" for="is_current">
                                            Currently working here
                                        </label>
                                    </div>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <label for="display_order" class="form-label">Display Order</label>
                                    <input type="number" class="form-control" id="display_order" name="display_order" 
                                           value="<?php echo $editWorkExp['display_order'] ?? '0'; ?>">
                                </div>
                            </div>

                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> <?php echo $action == 'add' ? 'Add' : 'Update'; ?> Work Experience
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
                                        <th>Position (EN)</th>
                                        <th>Company (EN)</th>
                                        <th>Period</th>
                                        <th>Order</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php while ($exp = $workExperiences->fetch(PDO::FETCH_ASSOC)): ?>
                                    <tr>
                                        <td><?php echo $exp['id']; ?></td>
                                        <td><?php echo htmlspecialchars($exp['position_en']); ?></td>
                                        <td><?php echo htmlspecialchars($exp['company_en']); ?></td>
                                        <td>
                                            <?php echo date('M Y', strtotime($exp['start_date'])); ?> - 
                                            <?php echo $exp['is_current'] ? 'Present' : date('M Y', strtotime($exp['end_date'])); ?>
                                        </td>
                                        <td><?php echo $exp['display_order']; ?></td>
                                        <td class="table-actions">
                                            <a href="?action=edit&id=<?php echo $exp['id']; ?>" 
                                               class="btn btn-sm btn-warning">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                            <a href="?delete=<?php echo $exp['id']; ?>" 
                                               class="btn btn-sm btn-danger" 
                                               onclick="return confirmDelete('Are you sure you want to delete this work experience?')">
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
