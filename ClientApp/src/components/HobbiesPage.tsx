import React, { useEffect, useState } from 'react';
import api from '../api';
import Navigation from './Navigation';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { sortByDisplayOrder } from '../utils/formatters';
import './HobbiesPage.css';

interface Hobby {
  id: number;
  name: string;
  icon?: string;
  description?: string;
  displayOrder: number;
}

interface HobbiesPageProps {
  onAdminClick?: () => void;
}

function HobbiesPage({ onAdminClick }: HobbiesPageProps) {
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const { t } = useLanguage();

  useEffect(() => {
    fetchHobbies();
  }, []);

  const fetchHobbies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/hobbies');
      if (Array.isArray(response.data)) {
        setHobbies(sortByDisplayOrder(response.data));
      } else {
        setError(t('hobbies.invalidData'));
      }
    } catch (err) {
      setError(t('hobbies.loadError'));
      console.error('Error fetching hobbies:', err);
    } finally {
      setLoading(false);
    }
  };

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
              {hobbies.map((hobby) => (
                <div key={hobby.id} className="hobby-card">
                  <div className="hobby-icon">
                    {hobby.icon ? (
                      <i className={`fas ${hobby.icon}`}></i>
                    ) : (
                      <i className="fas fa-heart"></i>
                    )}
                  </div>
                  <h3 className="hobby-name">{hobby.name}</h3>
                  {hobby.description && (
                    <p className="hobby-description">{hobby.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default HobbiesPage;
