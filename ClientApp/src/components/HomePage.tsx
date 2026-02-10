import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import TitleReveal from './TitleReveal';
import './HomePage.css';

interface HomePageProps {
  onAdminClick?: () => void;
}

function HomePage({ onAdminClick }: HomePageProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <div className={`home-page theme-${theme}`}>
      <Navigation onAdminClick={onAdminClick} />
      
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <TitleReveal text={t('home.heroTitle')} />
          </h1>
          <p className="hero-subtitle">{t('home.heroSubtitle')}</p>
          <div className="hero-buttons">
            <Link to="/projects" className="btn btn-primary btn-lg">
              {t('home.viewProjects')}
            </Link>
            <Link to="/about" className="btn btn-outline-primary btn-lg">
              {t('home.learnAbout')}
            </Link>
          </div>
        </div>
      </section>

      <section className="highlights-section">
        <div className="container py-5">
          <h2 className="section-title">{t('home.featuredHighlights')}</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="highlight-card">
                {/* <div className="highlight-icon">📁</div> */}
                <h3>{t('nav.projects')}</h3>
                <p>{t('home.projectsDescription')}</p>
                <Link to="/projects" className="highlight-link">
                  {t('home.browseProjects')} →
                </Link>
              </div>
            </div>
            <div className="col-md-4">
              <div className="highlight-card">
                {/* <div className="highlight-icon">💬</div> */}
                <h3>{t('nav.testimonials')}</h3>
                <p>{t('home.testimonialsDescription')}</p>
                <Link to="/testimonials" className="highlight-link">
                  {t('home.readTestimonials')} →
                </Link>
              </div>
            </div>
            <div className="col-md-4">
              <div className="highlight-card">
                {/* <div className="highlight-icon">👤</div> */}
                <h3>{t('nav.about')}</h3>
                <p>{t('home.aboutDescription')}</p>
                <Link to="/about" className="highlight-link">
                  {t('home.learnMore')} →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
