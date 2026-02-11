import React from 'react';
import Navigation from './Navigation';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useFetchData } from '../hooks';
import { sortByDisplayOrder } from '../utils/formatters';
import './HobbiesPage.css';

interface Hobby {
  id: number;
  name: string;
  nameFr?: string;
  icon?: string;
  description?: string;
  descriptionFr?: string;
  displayOrder: number;
}

interface HobbiesPageProps {
  onAdminClick?: () => void;
}

function HobbiesPage({ onAdminClick }: HobbiesPageProps) {
  const { data: hobbiesRaw, loading, error } = useFetchData<Hobby>('/hobbies');
  const { theme } = useTheme();
  const { t, language } = useLanguage();

  const hobbies = sortByDisplayOrder(hobbiesRaw);

  return (
    <div className={`hobbies-page theme-${theme}`}>
      <Navigation onAdminClick={onAdminClick} />
      
      <section className="hobbies-hero">
        <div className="hobbies-hero-content">
          <h1>{t('hobbies.title')}</h1>
          <p>{t('hobbies.subtitle')}</p>
        </div>
      </section>

      {/* Hobbies Grid */}
      <section className="hobbies-section">
        <div className="container py-5">
          {loading ? (
            <div className="loading">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">{t('common.loading')}</span>
              </div>
              <p>{t('hobbies.loadingHobbies')}</p>
            </div>
          ) : error ? (
            <div className="alert alert-info" role="alert">
              {error}
            </div>
          ) : hobbies.length === 0 ? (
            <div className="alert alert-info" role="alert">
              {t('hobbies.noHobbies')}
            </div>
          ) : (
            <div className="hobbies-grid">
              {hobbies.map((hobby) => {
                const displayName = language === 'fr' && hobby.nameFr ? hobby.nameFr : hobby.name;
                const displayDescription = language === 'fr' && hobby.descriptionFr ? hobby.descriptionFr : hobby.description;
                
                return (
                  <div key={hobby.id} className="hobby-card">
                    <div className="hobby-icon">
                      {hobby.icon ? (
                        <i className={`fas ${hobby.icon}`}></i>
                      ) : (
                        <i className="fas fa-heart"></i>
                      )}
                    </div>
                    <h3 className="hobby-name">{displayName}</h3>
                    {displayDescription && (
                      <p className="hobby-description">{displayDescription}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default HobbiesPage;
