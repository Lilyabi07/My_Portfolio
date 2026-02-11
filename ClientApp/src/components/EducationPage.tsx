import React, { useEffect, useState } from 'react';
import api from '../api';
import Navigation from './Navigation';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useScrollAnimation } from '../hooks';
import { LoadingSkeleton, EmptyState } from './common';
import { formatMonthYear, sortByDisplayOrder } from '../utils/formatters';
import './EducationPage.css';

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

interface EducationPageProps {
  onAdminClick?: () => void;
}

function EducationPage({ onAdminClick }: EducationPageProps) {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const { t, language } = useLanguage();

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
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <LoadingSkeleton key={i} type="card" />
              ))}
            </div>
          ) : error ? (
            <EmptyState
              icon="fas fa-exclamation-circle"
              title={t('common.error')}
              message={error}
            />
          ) : educations.length === 0 ? (
            <EmptyState
              icon="fas fa-graduation-cap"
              title={t('education.noEducation')}
              message="Education information coming soon."
              customEmoji="🎓"
            />
          ) : (
            <div className="timeline">
              {educations.map((edu, index) => (
                <EducationTimelineItem key={edu.id} education={edu} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

interface EducationTimelineItemProps {
  education: Education;
  index: number;
}

function EducationTimelineItem({ education: edu, index }: EducationTimelineItemProps) {
  const scrollRef = useScrollAnimation({ threshold: 0.1 });
  const { language, t } = useLanguage();

  const displayDegree = language === 'fr' && edu.degreeFr ? edu.degreeFr : edu.degree;
  const displayInstitution = language === 'fr' && edu.institutionFr ? edu.institutionFr : edu.institution;
  const displayDescription = language === 'fr' && edu.descriptionFr ? edu.descriptionFr : edu.description;
  const formatDate = (dateString: string) => formatMonthYear(dateString, t('education.locale'));

  return (
    <div ref={scrollRef} className="timeline-item">
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
}

export default EducationPage;
