<?php
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';

// Get database connection
$database = new Database();
$db = $database->getConnection();

// Initialize models
$skillModel = new Skill($db);
$projectModel = new Project($db);
$workExpModel = new WorkExperience($db);

// Get all data
$skills = $skillModel->getAll();
$projects = $projectModel->getAll();
$workExperiences = $workExpModel->getAll();

// Get current language
$lang = $_SESSION['lang'];

// Language switcher
if (isset($_GET['lang']) && in_array($_GET['lang'], ['en', 'es'])) {
    $_SESSION['lang'] = $_GET['lang'];
    header('Location: index.php');
    exit();
}

// Language labels
$labels = [
    'en' => [
        'welcome' => 'Welcome to My Portfolio',
        'skills' => 'Skills',
        'projects' => 'Projects',
        'experience' => 'Work Experience',
        'view_project' => 'View Project',
        'view_github' => 'GitHub',
        'technologies' => 'Technologies',
        'present' => 'Present',
        'admin' => 'Admin Login'
    ],
    'es' => [
        'welcome' => 'Bienvenido a Mi Portafolio',
        'skills' => 'Habilidades',
        'projects' => 'Proyectos',
        'experience' => 'Experiencia Laboral',
        'view_project' => 'Ver Proyecto',
        'view_github' => 'GitHub',
        'technologies' => 'Tecnologías',
        'present' => 'Presente',
        'admin' => 'Acceso Admin'
    ]
];

$l = $labels[$lang];
?>
<!DOCTYPE html>
<html lang="<?php echo $lang; ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Portfolio</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="public/css/style.css">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div class="container">
            <a class="navbar-brand" href="#home">Portfolio</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="#skills"><?php echo $l['skills']; ?></a></li>
                    <li class="nav-item"><a class="nav-link" href="#projects"><?php echo $l['projects']; ?></a></li>
                    <li class="nav-item"><a class="nav-link" href="#experience"><?php echo $l['experience']; ?></a></li>
                    <li class="nav-item">
                        <a class="nav-link" href="?lang=<?php echo $lang == 'en' ? 'es' : 'en'; ?>">
                            <i class="fas fa-globe"></i> <?php echo $lang == 'en' ? 'ES' : 'EN'; ?>
                        </a>
                    </li>
                    <li class="nav-item"><a class="nav-link" href="admin/login.php"><?php echo $l['admin']; ?></a></li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="hero-section">
        <div class="container">
            <h1 class="display-3 text-white"><?php echo $l['welcome']; ?></h1>
            <p class="lead text-white-50">Professional Portfolio</p>
        </div>
    </section>

    <!-- Skills Section -->
    <section id="skills" class="py-5">
        <div class="container">
            <h2 class="text-center mb-5"><?php echo $l['skills']; ?></h2>
            <div class="row">
                <?php while ($skill = $skills->fetch(PDO::FETCH_ASSOC)): ?>
                <div class="col-md-6 mb-4">
                    <div class="skill-item">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h5>
                                <?php if ($skill['icon']): ?>
                                <i class="<?php echo htmlspecialchars($skill['icon']); ?>"></i>
                                <?php endif; ?>
                                <?php echo htmlspecialchars($skill['name_' . $lang]); ?>
                            </h5>
                            <span><?php echo $skill['percentage']; ?>%</span>
                        </div>
                        <div class="progress">
                            <div class="progress-bar bg-primary" role="progressbar" 
                                 style="width: <?php echo $skill['percentage']; ?>%" 
                                 aria-valuenow="<?php echo $skill['percentage']; ?>" 
                                 aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                </div>
                <?php endwhile; ?>
            </div>
        </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="py-5 bg-light">
        <div class="container">
            <h2 class="text-center mb-5"><?php echo $l['projects']; ?></h2>
            <div class="row">
                <?php while ($project = $projects->fetch(PDO::FETCH_ASSOC)): ?>
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card h-100">
                        <?php if ($project['image']): ?>
                        <img src="public/uploads/<?php echo htmlspecialchars($project['image']); ?>" 
                             class="card-img-top" alt="<?php echo htmlspecialchars($project['title_' . $lang]); ?>">
                        <?php endif; ?>
                        <div class="card-body">
                            <h5 class="card-title"><?php echo htmlspecialchars($project['title_' . $lang]); ?></h5>
                            <p class="card-text"><?php echo htmlspecialchars($project['description_' . $lang]); ?></p>
                            <?php if ($project['technologies']): ?>
                            <p class="text-muted"><small><strong><?php echo $l['technologies']; ?>:</strong> 
                                <?php echo htmlspecialchars($project['technologies']); ?></small></p>
                            <?php endif; ?>
                        </div>
                        <div class="card-footer bg-transparent">
                            <?php if ($project['project_url']): ?>
                            <a href="<?php echo htmlspecialchars($project['project_url']); ?>" 
                               class="btn btn-sm btn-primary" target="_blank"><?php echo $l['view_project']; ?></a>
                            <?php endif; ?>
                            <?php if ($project['github_url']): ?>
                            <a href="<?php echo htmlspecialchars($project['github_url']); ?>" 
                               class="btn btn-sm btn-dark" target="_blank"><?php echo $l['view_github']; ?></a>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
                <?php endwhile; ?>
            </div>
        </div>
    </section>

    <!-- Work Experience Section -->
    <section id="experience" class="py-5">
        <div class="container">
            <h2 class="text-center mb-5"><?php echo $l['experience']; ?></h2>
            <div class="timeline">
                <?php while ($exp = $workExperiences->fetch(PDO::FETCH_ASSOC)): ?>
                <div class="timeline-item mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title"><?php echo htmlspecialchars($exp['position_' . $lang]); ?></h5>
                            <h6 class="card-subtitle mb-2 text-muted"><?php echo htmlspecialchars($exp['company_' . $lang]); ?></h6>
                            <p class="text-muted">
                                <small>
                                    <?php echo date('M Y', strtotime($exp['start_date'])); ?> - 
                                    <?php echo $exp['is_current'] ? $l['present'] : date('M Y', strtotime($exp['end_date'])); ?>
                                </small>
                            </p>
                            <p class="card-text"><?php echo nl2br(htmlspecialchars($exp['description_' . $lang])); ?></p>
                        </div>
                    </div>
                </div>
                <?php endwhile; ?>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark text-white text-center py-4">
        <div class="container">
            <p>&copy; <?php echo date('Y'); ?> My Portfolio. All rights reserved.</p>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="public/js/script.js"></script>
</body>
</html>
