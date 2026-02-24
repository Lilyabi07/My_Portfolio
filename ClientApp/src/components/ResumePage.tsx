import React, { useState } from 'react';
import Navigation from './Navigation';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useFetchData } from '../hooks';
import { formatMonthYear, sortByDateDescending } from '../utils/formatters';
import './ResumePage.css';

interface WorkExperience {
  id: number;
  company: string;
  companyFr?: string;
  position: string;
  positionFr?: string;
  startDate: string;
  endDate?: string;
  description: string;
  descriptionFr?: string;
  location?: string;
  displayOrder: number;
}

interface Education {
  id: number;
  institution: string;
  institutionFr?: string;
  degree: string;
  degreeFr?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  descriptionFr?: string;
  displayOrder: number;
}

interface ResumePageProps {
  onAdminClick?: () => void;
}

function ResumePage({ onAdminClick }: ResumePageProps) {
  const { data: experiencesRaw, loading: loadingExp, error: errorExp } = useFetchData<WorkExperience>('/work-experience');
  const { data: educationsRaw, loading: loadingEdu, error: errorEdu } = useFetchData<Education>('/education');
  const { theme } = useTheme();
  const { t, language } = useLanguage();

  // Sort data by date in reverse chronological order (most recent first)
  const experiences = sortByDateDescending(experiencesRaw);
  const educations = sortByDateDescending(educationsRaw);
  const loading = loadingExp || loadingEdu;
  const error = errorExp || errorEdu;

  const formatDate = (dateString: string) => formatMonthYear(dateString, t('resume.locale'));

  return (
    <div className={`resume-page theme-${theme}`}>
      <Navigation onAdminClick={onAdminClick} />
      
      <section className="resume-hero">
        <div className="resume-hero-content">
          <h1>{t('resume.title')}</h1>
          <p>{t('resume.subtitle')}</p>
        </div>
      </section>

      {/* Education Timeline */}
      <section className="education-section">
        <div className="container py-5">
          <h2 className="section-title">{t('education.educationHistory')}</h2>
          {educations.length === 0 ? (
            <div className="alert alert-info" role="alert">
              {t('education.noEducation')}
            </div>
          ) : (
            <div className="timeline">
              {educations.map((edu) => {
                const displayDegree = language === 'fr' && edu.degreeFr ? edu.degreeFr : edu.degree;
                const displayInstitution = language === 'fr' && edu.institutionFr ? edu.institutionFr : edu.institution;
                const displayDescription = language === 'fr' && edu.descriptionFr ? edu.descriptionFr : edu.description;
                
                return (
                  <div key={edu.id} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <div className="education-card">
                        <div className="education-header">
                          <div>
                            <h3 className="degree">{displayDegree}</h3>
                            <h4 className="institution">{displayInstitution}</h4>
                          </div>
                          {edu.isCurrent && (
                            <span className="badge-current">
                              <i className="fas fa-circle"></i> {t('education.current')}
                            </span>
                          )}
                        </div>
                        <div className="date-info">
                          <span className="date-range">
                            <i className="fas fa-calendar me-2"></i>
                            {formatDate(edu.startDate)} - {edu.isCurrent ? t('education.present') : formatDate(edu.endDate || '')}
                          </span>
                        </div>
                        {displayDescription && (
                          <p className="description">{displayDescription}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Work Experience Timeline */}
      <section className="experience-section">
        <div className="container py-5">
          <h2 className="section-title">{t('resume.experienceTitle')}</h2>
          
          {loading ? (
            <div className="loading">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">{t('common.loading')}</span>
              </div>
              <p>{t('resume.loadingExperience')}</p>
            </div>
          ) : error ? (
            <div className="alert alert-info" role="alert">
              {error}
            </div>
          ) : experiences.length === 0 ? (
            <div className="alert alert-info" role="alert">
              {t('resume.noExperience')}
            </div>
          ) : (
            <div className="timeline">
              {experiences.map((exp, index) => {
                const displayPosition = language === 'fr' && exp.positionFr ? exp.positionFr : exp.position;
                const displayCompany = language === 'fr' && exp.companyFr ? exp.companyFr : exp.company;
                const displayDescription = language === 'fr' && exp.descriptionFr ? exp.descriptionFr : exp.description;

                return (
                <div key={exp.id} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="experience-card">
                      <div className="experience-header">
                        <h3 className="position">{displayPosition}</h3>
                        <span className="date-range">
                          {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : t('resume.present')}
                        </span>
                      </div>
                      <div className="company-info">
                        <h4 className="company">{displayCompany}</h4>
                        {exp.location && (
                          <span className="location">
                            <i className="fas fa-map-marker-alt me-2"></i>
                            {exp.location}
                          </span>
                        )}
                      </div>
                      <p className="description">{displayDescription}</p>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default ResumePage;
