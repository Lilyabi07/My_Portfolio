import React, { useEffect, useState } from 'react';
import api from '../api';
import Navigation from './Navigation';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import './ProjectsPage.css';

interface Project {
  id: number;
  title: string;
  description: string;
  technologies?: string[];
  imageUrl?: string;
  link?: string;
  github?: string;
}

interface ProjectsPageProps {
  onAdminClick?: () => void;
}

function ProjectsPage({ onAdminClick }: ProjectsPageProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { theme } = useTheme();
  const { t } = useLanguage();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/projects');
      if (Array.isArray(response.data)) {
        setProjects(response.data);
      } else {
        setError(t('projects.invalidData'));
      }
    } catch (err) {
      setError(t('projects.loadError'));
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`projects-page theme-${theme}`}>
      <Navigation onAdminClick={onAdminClick} />
      
      <section className="projects-hero">
        <div className="projects-hero-content">
          <h1>{t('projects.title')}</h1>
          <p>{t('projects.subtitle')}</p>
        </div>
      </section>

      <section className="projects-list">
        <div className="container py-5">
          {loading ? (
            <div className="loading">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">{t('common.loading')}</span>
              </div>
              <p>{t('projects.loading')}</p>
            </div>
          ) : error ? (
            <div className="alert alert-info" role="alert">
              {error}
            </div>
          ) : projects.length === 0 ? (
            <div className="alert alert-info" role="alert">
              {t('projects.empty')}
            </div>
          ) : (
            <div className="row g-4">
              {projects.map((project) => (
                <div key={project.id} className="col-md-6 col-lg-4">
                  <div className="project-card" onClick={() => setSelectedProject(project)} style={{ cursor: 'pointer' }}>
                    {project.imageUrl && (
                      <div className="project-image">
                        <img src={project.imageUrl} alt={project.title} />
                      </div>
                    )}
                    <div className="project-content">
                      <h3 className="project-title">{project.title}</h3>
                      <p className="project-description">
                        {project.description.length > 100 
                          ? `${project.description.substring(0, 100)}...` 
                          : project.description}
                      </p>
                      {Array.isArray(project.technologies) && project.technologies.length > 0 && (
                        <div className="project-tech">
                          {project.technologies.map((tech, idx) => (
                            <span key={idx} className="tech-badge">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="project-links">
                        {project.link && (
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn-link">
                            {t('projects.viewDemo')}
                          </a>
                        )}
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-link">
                            {t('projects.sourceCode')}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Project Details Modal */}
      {selectedProject && (
        <div 
          className="modal show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setSelectedProject(null)}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedProject.title}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setSelectedProject(null)}
                  aria-label={t('common.close')}
                ></button>
              </div>
              <div className="modal-body">
                {selectedProject.imageUrl && (
                  <img 
                    src={selectedProject.imageUrl} 
                    alt={selectedProject.title} 
                    className="img-fluid mb-3 rounded"
                  />
                )}
                <h6>{t('projects.description')}</h6>
                <p>{selectedProject.description}</p>
                
                {Array.isArray(selectedProject.technologies) && selectedProject.technologies.length > 0 && (
                  <>
                    <h6 className="mt-3">{t('projects.technologies')}</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech, idx) => (
                        <span key={idx} className="badge bg-primary">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </>
                )}
                
                <div className="mt-4 d-flex gap-2">
                  {selectedProject.link && (
                    <a 
                      href={selectedProject.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-primary"
                    >
                      <i className="fas fa-external-link-alt me-2"></i>
                      {t('projects.viewDemo')}
                    </a>
                  )}
                  {selectedProject.github && (
                    <a 
                      href={selectedProject.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-dark"
                    >
                      <i className="fab fa-github me-2"></i>
                      {t('projects.sourceCode')}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;
