import React, { useEffect, useState } from 'react';
import api from '../api';

interface Skill {
  id: number;
  name: string;
  proficiency: number;
  icon: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string;
}

const Portfolio: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const skillsResponse = await api.get('/portfolio/skills');
        const projectsResponse = await api.get('/portfolio/projects');
        setSkills(skillsResponse.data);
        setProjects(projectsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center p-5">Loading...</div>;
  }

  return (
    <div className="portfolio-container">
      <header className="App-header">
        <h1>My Portfolio</h1>
        <p>Built with ASP.NET MVC and React</p>
      </header>

      <section className="skills-section container">
        <h2 className="text-center mb-4">Skills</h2>
        <div className="row">
          {Array.isArray(skills) && skills.length > 0 ? (
            skills.map((skill) => (
              <div key={skill.id} className="col-md-4">
                <div className="skill-card">
                  <i className={`fas ${skill.icon} fa-3x mb-3`}></i>
                  <h4>{skill.name}</h4>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${skill.proficiency}%` }}
                      aria-valuenow={skill.proficiency}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      {skill.proficiency}%
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-12 text-center">No skills available.</p>
          )}
        </div>
      </section>

      <section className="projects-section container">
        <h2 className="text-center mb-4">Projects</h2>
        <div className="row">
          {Array.isArray(projects) && projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id} className="col-md-6">
                <div className="project-card">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <p className="text-muted">
                    <strong>Technologies:</strong> {project.technologies}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="col-12 text-center">No projects available.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
