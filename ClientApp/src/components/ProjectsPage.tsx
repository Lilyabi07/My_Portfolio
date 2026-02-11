import React, { useState } from 'react';
import Navigation from './Navigation';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useFetchData, useScrollAnimation } from '../hooks';
import { LoadingSkeleton, EmptyState } from './common';
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
  const { data: projects, loading, error } = useFetchData<Project>('/projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { theme } = useTheme();
  const { t } = useLanguage();

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
            <div className="row g-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="col-md-6 col-lg-4">
                  <LoadingSkeleton type="card" />
                </div>
              ))}
            </div>
          ) : error ? (
            <EmptyState
              icon="fas fa-exclamation-circle"
              title={t('common.error')}
              message={error}
            />
          ) : projects.length === 0 ? (
            <EmptyState
              icon="fas fa-briefcase"
              title={t('projects.empty')}
              message="No projects available yet. Check back soon!"
              customEmoji="📋"
            />
          ) : (
            <div className="row g-4">
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} onSelect={setSelectedProject} />
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

// Separate component for project cards to apply scroll animations
interface ProjectCardProps {
  project: Project;
  index: number;
  onSelect: (project: Project) => void;
}

function ProjectCard({ project, index, onSelect }: ProjectCardProps) {
  const scrollRef = useScrollAnimation({ threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  const { t } = useLanguage();

  return (
    <div ref={scrollRef} className="col-md-6 col-lg-4">
      <div className="project-card" onClick={() => onSelect(project)} style={{ cursor: 'pointer' }}>
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
  );
}

export default ProjectsPage;
