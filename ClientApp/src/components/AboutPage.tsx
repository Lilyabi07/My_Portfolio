import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navigation from './Navigation';
import './AboutPage.css';

interface Skill {
  id: number;
  name: string;
  proficiency: number;
  category?: string;
}

interface AboutPageProps {
  onAdminClick?: () => void;
}

function AboutPage({ onAdminClick }: AboutPageProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/skills');
      if (Array.isArray(response.data)) {
        setSkills(response.data);
      } else {
        setError('Invalid data format received');
      }
    } catch (err) {
      setError('Failed to load skills. Please try again later.');
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="about-page">
      <Navigation onAdminClick={onAdminClick} />
      
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About Me</h1>
          <p>Professional developer with passion for building modern web applications</p>
        </div>
      </section>

      <section className="about-content">
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-6 mb-4">
              <div className="about-intro">
                <h2>Who Am I?</h2>
                <p>
                  I'm a passionate full-stack developer with experience in building modern, responsive web applications.
                  My journey in tech started with a curiosity about how things work, which evolved into a career focused
                  on delivering high-quality solutions.
                </p>
                <p>
                  I specialize in creating seamless user experiences through clean code and thoughtful design.
                  Whether it's frontend frameworks or backend services, I'm committed to staying current with the latest technologies.
                </p>
                <p>
                  When I'm not coding, you can find me exploring new technologies, contributing to open-source projects,
                  or sharing knowledge with the developer community.
                </p>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="about-stats">
                <div className="stat-box">
                  <div className="stat-number">5+</div>
                  <div className="stat-label">Years Experience</div>
                </div>
                <div className="stat-box">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Projects Completed</div>
                </div>
                <div className="stat-box">
                  <div className="stat-number">30+</div>
                  <div className="stat-label">Happy Clients</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="skills-section">
        <div className="container py-5">
          <h2>My Skills</h2>
          {loading ? (
            <div className="loading">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-info" role="alert">
              {error}
            </div>
          ) : skills.length === 0 ? (
            <div className="alert alert-info" role="alert">
              No skills available at this time.
            </div>
          ) : (
            <>
              {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <div key={category} className="skill-category">
                  <h3>{category}</h3>
                  <div className="skills-grid">
                    {categorySkills.map((skill) => (
                      <div key={skill.id} className="skill-item">
                        <div className="skill-header">
                          <span className="skill-name">{skill.name}</span>
                          <span className="skill-percentage">{skill.proficiency}%</span>
                        </div>
                        <div className="skill-bar">
                          <div
                            className="skill-progress"
                            style={{ width: `${skill.proficiency}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
