import React, { useEffect, useState } from 'react';
import api from '../api';
import Navigation from './Navigation';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { formatMonthYear, sortByDisplayOrder } from '../utils/formatters';
import './EducationPage.css';

interface Education {
  id: number;
  institution: string;
  degree: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  displayOrder: number;
}

interface EducationPageProps {
  onAdminClick?: () => void;
}

function EducationPage({ onAdminClick }: EducationPageProps) {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const { t } = useLanguage();

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/education');
      if (Array.isArray(response.data)) {
        setEducations(sortByDisplayOrder(response.data));
      } else {
        setError(t('education.invalidData'));
      }
    } catch (err) {
      setError(t('education.loadError'));
      console.error('Error fetching education:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => formatMonthYear(dateString, t('education.locale'));

  return (
    <div className={`education-page theme-${theme}`}>
      <Navigation onAdminClick={onAdminClick} />
      
      <section className="education-hero">
        <div className="education-hero-content">
          <h1>{t('education.title')}</h1>
          <p>{t('education.subtitle')}</p>
        </div>
      </section>

      {/* Education Timeline */}
      <section className="education-section">
        <div className="container py-5">
          <h2 className="section-title">{t('education.educationHistory')}</h2>
          
          {loading ? (
            <div className="loading">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">{t('common.loading')}</span>
              </div>
              <p>{t('education.loadingEducation')}</p>
            </div>
          ) : error ? (
            <div className="alert alert-info" role="alert">
              {error}
            </div>
          ) : educations.length === 0 ? (
            <div className="alert alert-info" role="alert">
              {t('education.noEducation')}
            </div>
          ) : (
            <div className="timeline">
              {educations.map((edu, index) => (
                <div key={edu.id} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="education-card">
                      <div className="education-header">
                        <div>
                          <h3 className="degree">{edu.degree}</h3>
                          <h4 className="institution">{edu.institution}</h4>
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

                      {edu.description && (
                        <p className="description">{edu.description}</p>
                      )}
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

export default EducationPage;
