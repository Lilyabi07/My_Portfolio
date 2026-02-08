import React, { useEffect, useState } from 'react';
import api from '../api';
import Navigation from './Navigation';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import './AboutPage.css';

interface Skill {
  id: number;
  name: string;
  proficiency: number;
  icon?: string;
  category?: string;
}

interface AboutPageProps {
  onAdminClick?: () => void;
}

function AboutPage({ onAdminClick }: AboutPageProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const { theme } = useTheme();
  const { t } = useLanguage();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/skills');
      if (Array.isArray(response.data)) {
        setSkills(response.data);
      } else {
        setError(t('about.invalidData'));
      }
    } catch (err) {
      setError(t('about.loadError'));
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || t('common.other');
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className={`about-page theme-${theme}`}>
      <Navigation onAdminClick={onAdminClick} />
      
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>{t('about.title')}</h1>
          <p>{t('about.subtitle')}</p>
        </div>
      </section>

      <section className="about-content">
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-6 mb-4">
              <div className="about-intro">
                <h2>{t('about.whoTitle')}</h2>
                <p>{t('about.whoParagraph1')}</p>
                <p>{t('about.whoParagraph2')}</p>
                <p>{t('about.whoParagraph3')}</p>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="about-stats">
                <div className="stat-box">
                  <div className="stat-number">5+</div>
                  <div className="stat-label">{t('about.stats.experience')}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">{t('about.stats.projects')}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-number">30+</div>
                  <div className="stat-label">{t('about.stats.clients')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="skills-section">
        <div className="container py-5">
          <h2>{t('about.skills.title')}</h2>
          {loading ? (
            <div className="loading">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">{t('common.loading')}</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-info" role="alert">
              {error}
            </div>
          ) : skills.length === 0 ? (
            <div className="alert alert-info" role="alert">
              {t('about.skills.empty')}
            </div>
          ) : (
            <>
              {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <div key={category} className="skill-category">
                  <h3>{category}</h3>
                  <div className="skills-grid">
                    {categorySkills.map((skill) => (
                      <div 
                        key={skill.id} 
                        className="skill-item" 
                        onClick={() => setSelectedSkill(skill)}
                        style={{ cursor: 'pointer' }}
                      >
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

      {/* Skill Details Modal */}
      {selectedSkill && (
        <div 
          className="modal show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setSelectedSkill(null)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedSkill.icon && <i className={`fas ${selectedSkill.icon} me-2`}></i>}
                  {selectedSkill.name}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setSelectedSkill(null)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <h6>{t('about.skills.proficiency')}</h6>
                <div className="mb-3">
                  <div className="progress" style={{ height: '30px' }}>
                    <div 
                      className="progress-bar progress-bar-striped progress-bar-animated" 
                      role="progressbar" 
                      style={{ width: `${selectedSkill.proficiency}%` }}
                      aria-valuenow={selectedSkill.proficiency}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      {selectedSkill.proficiency}%
                    </div>
                  </div>
                </div>
                
                <div className="skill-level-description mt-3">
                  {selectedSkill.proficiency >= 90 && (
                    <div className="alert alert-success">
                      <strong>{t('about.skills.levels.expert.title')}</strong> - {t('about.skills.levels.expert.desc')}
                    </div>
                  )}
                  {selectedSkill.proficiency >= 70 && selectedSkill.proficiency < 90 && (
                    <div className="alert alert-info">
                      <strong>{t('about.skills.levels.advanced.title')}</strong> - {t('about.skills.levels.advanced.desc')}
                    </div>
                  )}
                  {selectedSkill.proficiency >= 50 && selectedSkill.proficiency < 70 && (
                    <div className="alert alert-warning">
                      <strong>{t('about.skills.levels.intermediate.title')}</strong> - {t('about.skills.levels.intermediate.desc')}
                    </div>
                  )}
                  {selectedSkill.proficiency < 50 && (
                    <div className="alert alert-secondary">
                      <strong>{t('about.skills.levels.beginner.title')}</strong> - {t('about.skills.levels.beginner.desc')}
                    </div>
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

export default AboutPage;
