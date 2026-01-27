<?php
require_once __DIR__ . '/includes/auth_check.php';

// Get database connection
$database = new Database();
$db = $database->getConnection();

// Initialize models
$skillModel = new Skill($db);
$projectModel = new Project($db);
$workExpModel = new WorkExperience($db);

// Get counts
$skillsCount = $skillModel->getAll()->rowCount();
$projectsCount = $projectModel->getAll()->rowCount();
$workExpCount = $workExpModel->getAll()->rowCount();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Portfolio</title>
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
                            <a class="nav-link active" href="index.php">
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
                    <h1 class="h2">Dashboard</h1>
                </div>

                <!-- Stats Cards -->
                <div class="row mb-4">
                    <div class="col-md-4 mb-3">
                        <div class="card dashboard-card">
                            <div class="card-body">
                                <h5 class="card-title">Skills</h5>
                                <p class="display-4"><?php echo $skillsCount; ?></p>
                                <a href="skills.php" class="btn btn-sm btn-primary">Manage</a>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 mb-3">
                        <div class="card dashboard-card">
                            <div class="card-body">
                                <h5 class="card-title">Projects</h5>
                                <p class="display-4"><?php echo $projectsCount; ?></p>
                                <a href="projects.php" class="btn btn-sm btn-success">Manage</a>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4 mb-3">
                        <div class="card dashboard-card">
                            <div class="card-body">
                                <h5 class="card-title">Work Experience</h5>
                                <p class="display-4"><?php echo $workExpCount; ?></p>
                                <a href="work_experience.php" class="btn btn-sm btn-warning">Manage</a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="card">
                    <div class="card-header">
                        <h5>Quick Actions</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6 mb-2">
                                <a href="skills.php?action=add" class="btn btn-outline-primary w-100">
                                    <i class="fas fa-plus"></i> Add New Skill
                                </a>
                            </div>
                            <div class="col-md-6 mb-2">
                                <a href="projects.php?action=add" class="btn btn-outline-success w-100">
                                    <i class="fas fa-plus"></i> Add New Project
                                </a>
                            </div>
                            <div class="col-md-6 mb-2">
                                <a href="work_experience.php?action=add" class="btn btn-outline-warning w-100">
                                    <i class="fas fa-plus"></i> Add Work Experience
                                </a>
                            </div>
                            <div class="col-md-6 mb-2">
                                <a href="../index.php" class="btn btn-outline-info w-100" target="_blank">
                                    <i class="fas fa-eye"></i> Preview Website
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="alert alert-info mt-4">
                    <i class="fas fa-info-circle"></i> 
                    <strong>Note:</strong> All changes you make will be reflected immediately on the public website.
                    The website supports English and Spanish languages.
                </div>
            </main>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
