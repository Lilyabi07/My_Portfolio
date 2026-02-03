import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navigation from './Navigation';
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

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/projects');
      if (Array.isArray(response.data)) {
        setProjects(response.data);
      } else {
        setError('Invalid data format received');
      }
    } catch (err) {
      setError('Failed to load projects. Please try again later.');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="projects-page">
      <Navigation onAdminClick={onAdminClick} />
      
      <section className="projects-hero">
        <div className="projects-hero-content">
          <h1>My Projects</h1>
          <p>Explore the work I've created and the technologies I've utilized</p>
        </div>
      </section>

      <section className="projects-list">
        <div className="container py-5">
          {loading ? (
            <div className="loading">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Loading projects...</p>
            </div>
          ) : error ? (
            <div className="alert alert-info" role="alert">
              {error}
            </div>
          ) : projects.length === 0 ? (
            <div className="alert alert-info" role="alert">
              No projects available at this time.
            </div>
          ) : (
            <div className="row g-4">
              {projects.map((project) => (
                <div key={project.id} className="col-md-6 col-lg-4">
                  <div className="project-card">
                    {project.imageUrl && (
                      <div className="project-image">
                        <img src={project.imageUrl} alt={project.title} />
                      </div>
                    )}
                    <div className="project-content">
                      <h3 className="project-title">{project.title}</h3>
                      <p className="project-description">{project.description}</p>
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
                            View Demo
                          </a>
                        )}
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-link">
                            GitHub
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
    </div>
  );
}

export default ProjectsPage;
