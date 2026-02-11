import React, { useState } from 'react';
import Navigation from './Navigation';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useSpamPrevention } from '../hooks';
import './ContactPage.css';
import api from '../api';
import { hasProfanity } from '../utils/badWordsFilter';

interface ContactPageProps {
  onAdminClick?: () => void;
}

function ContactPage({ onAdminClick }: ContactPageProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { validateSpamPrevention, getHoneypotProps } = useSpamPrevention();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: '' // Honeypot field
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Validate spam prevention (honeypot + time)
    const spamCheck = validateSpamPrevention(formData.website);
    if (!spamCheck.valid) {
      setError(spamCheck.error || 'Submission rejected');
      setLoading(false);
      return;
    }

    // Check for profanity in message and name
    const combinedText = `${formData.name} ${formData.message}`;
    const profanityCheck = hasProfanity(combinedText);
    
    if (profanityCheck.hasProfanity) {
      setError(`${t('validation.profanity')}${profanityCheck.words.join(', ')}`);
      setLoading(false);
      return;
    }

    try {
      // Only send the actual form fields (not the honeypot)
      const { website, ...actualFormData } = formData;
      await api.post('/contact/send', actualFormData);
      setSuccess(true);
      setFormData({ name: '', email: '', message: '', website: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || t('contact.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`contact-page theme-${theme}`}>
      <Navigation onAdminClick={onAdminClick} />
      
      <section className="contact-hero">
        <div className="container">
          <h1 className="hero-title">{t('contact.title')}</h1>
          <p className="hero-subtitle">{t('contact.subtitle')}</p>
        </div>
      </section>

      <section className="contact-form-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="contact-form-card">
                {success && (
                  <div className="alert alert-success" role="alert">
                    <i className="fas fa-check-circle me-2"></i>
                    {t('contact.success')}
                  </div>
                )}
                
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Honeypot field - hidden from users, only bots fill this */}
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    {...getHoneypotProps()}
                  />

                  <div className="mb-4">
                    <label htmlFor="name" className="form-label">{t('contact.name')}</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder={t('contact.placeholders.name')}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="form-label">{t('contact.email')}</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder={t('contact.placeholders.email')}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="message" className="form-label">{t('contact.message')}</label>
                    <textarea
                      className="form-control"
                      id="message"
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      placeholder={t('contact.placeholders.message')}
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {t('contact.sending')}
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i>
                        {t('contact.send')}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
