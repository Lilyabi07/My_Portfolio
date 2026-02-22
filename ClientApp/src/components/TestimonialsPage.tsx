import React, { useEffect, useState } from 'react';
import api from '../api';
import Navigation from './Navigation';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useSpamPrevention, useFetchData, useScrollAnimation } from '../hooks';
import { LoadingSkeleton, EmptyState } from './common';
import './TestimonialsPage.css';

interface Testimonial {
  id: number;
  name: string;
  title: string;
  company: string;
  message: string;
  avatar?: string;
  rating?: number;
  isPublished?: boolean;
}

interface TestimonialsPageProps {
  onAdminClick?: () => void;
}

function TestimonialsPage({ onAdminClick }: TestimonialsPageProps) {
  const { data: testimonials, loading, error, refetch: refetchTestimonials } = useFetchData<Testimonial>('/testimonials');
  const { validateSpamPrevention, getHoneypotProps } = useSpamPrevention();
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [formLoadTime, setFormLoadTime] = useState(0); // Track when form loaded
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    message: '',
    rating: 5,
    website: '' // Honeypot field
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    // Validate spam prevention (honeypot + time)
    const spamCheck = validateSpamPrevention(formData.website);
    if (!spamCheck.valid) {
      setSubmitError(spamCheck.error || 'Submission rejected');
      setSubmitting(false);
      return;
    }

    try {
      // Only send the actual form fields (not the honeypot)
      const { website, ...actualFormData } = formData;
      await api.post('/testimonials', actualFormData);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        title: '',
        company: '',
        message: '',
        rating: 5,
        website: ''
      });
      setTimeout(() => {
        setShowModal(false);
        setSubmitSuccess(false);
        setShowSuccessPopup(true);
        refetchTestimonials(); // Refresh testimonials list
        // Hide popup after 5 seconds
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 5000);
      }, 2000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to submit testimonial. Please try again.';
      setSubmitError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [testimonials.length]);

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <i
            key={i}
            className={`fas fa-star ${i < rating ? 'filled' : 'empty'}`}
          ></i>
        ))}
      </div>
    );
  };

  const totalPages = Math.max(1, Math.ceil(testimonials.length / pageSize));
  const paginatedTestimonials = testimonials.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(nextPage);
  };

  return (
    <div className={`testimonials-page theme-${theme}`}>
      <Navigation onAdminClick={onAdminClick} />
      
      {/* Success Notification Popup */}
      {showSuccessPopup && (
        <div className="success-notification-popup">
          <div className="notification-content">
            <div className="notification-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h3>{t('testimonials.submittedTitle')}</h3>
            <p>{t('testimonials.reviewNotice')}</p>
            <button 
              className="btn btn-sm btn-outline-light"
              onClick={() => setShowSuccessPopup(false)}
            >
              {t('common.gotIt')}
            </button>
          </div>
        </div>
      )}
      
      <section className="testimonials-hero">
        {/* <button 
          className="btn-back-testimonials" 
          onClick={() => navigate('/')}
          title="Back to homepage"
        >
          <i className="fas fa-arrow-left"></i> Back to Home
        </button> */}
        <div className="testimonials-hero-content">
          <h1>{t('nav.testimonials')}</h1>
          <p>{t('testimonials.subtitle')}</p>
        </div>
      </section>

      <section className="testimonials-list">
        <div className="container py-5">
          <div className="text-center mb-5">
            <button
              className="btn btn-lg btn-success"
              onClick={() => {
                setShowModal(true);
                setFormLoadTime(Date.now()); // Track when form opens
              }}
            >
              <i className="fas fa-plus"></i> {t('testimonials.addTestimonial')}
            </button>
          </div>

          {loading ? (
            <div className="row g-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="col-md-6 col-lg-4">
                  <LoadingSkeleton type="card" />
                </div>
              ))}
            </div>
          ) : error ? (
            <EmptyState
              icon="fas fa-exclamation-circle"
              title={t('common.error')}
              message={error}
            />
          ) : testimonials.length === 0 ? (
            <EmptyState
              icon="fas fa-comments"
              title={t('testimonials.noTestimonials') || 'No Testimonials Yet'}
              message="Be the first to share your experience! Click the button above to submit a testimonial."
              customEmoji="💬"
              actionButton={{
                label: t('testimonials.addTestimonial'),
                onClick: () => {
                  setShowModal(true);
                  setFormLoadTime(Date.now());
                }
              }}
            />
          ) : (
            <div className="row g-4">
              {paginatedTestimonials.map((testimonial, index) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
              ))}
            </div>
          )}

          {testimonials.length > 0 && totalPages > 1 && !loading && !error && (
            <nav className="mt-5" aria-label={t('common.pagination') || 'Pagination'}>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    aria-label={t('common.previous') || 'Previous'}
                  >
                    {t('common.previous') || 'Previous'}
                  </button>
                </li>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    aria-label={t('common.next') || 'Next'}
                  >
                    {t('common.next') || 'Next'}
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </section>

      {/* Submission Modal */}
      <div
        className={`modal fade ${showModal ? 'show' : ''}`}
        id="testimonialModal"
        tabIndex={-1}
        style={{ display: showModal ? 'block' : 'none', backgroundColor: 'rgba(0,0,0,0.5)' }}
        aria-labelledby="testimonialModalLabel"
        aria-hidden={!showModal}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="testimonialModalLabel">
                <i className="fas fa-star"></i> {t('testimonials.addTestimonial')}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
                aria-label={t('common.close')}
              ></button>
            </div>
            <div className="modal-body">
              {submitSuccess ? (
                <div className="alert alert-success" role="alert">
                  <i className="fas fa-check-circle"></i> {t('testimonials.success')}
                </div>
              ) : (
                <>
                  {submitError && (
                    <div className="alert alert-danger" role="alert">
                      <i className="fas fa-exclamation-circle"></i> {submitError || t('testimonials.error')}
                    </div>
                  )}
                  <form onSubmit={handleSubmit}>
                  {/* Honeypot field - hidden from users, only bots fill this, */}
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    {...getHoneypotProps()}
                  />

                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      {t('testimonials.name')} <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      maxLength={100}
                      placeholder={t('contact.placeholders.name')}
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="title" className="form-label">
                        {t('testimonials.jobTitle')} <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        maxLength={100}
                        placeholder={t('testimonials.jobTitle')}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="company" className="form-label">
                        {t('testimonials.company')} <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        required
                        maxLength={100}
                        placeholder={t('testimonials.company')}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="message" className="form-label">
                      {t('testimonials.message')} <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      required
                      maxLength={500}
                      placeholder={t('contact.placeholders.message')}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="rating" className="form-label">
                      {t('testimonials.rating')} <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="rating"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    >
                      <option value={5}>★★★★★ (5)</option>
                      <option value={4}>★★★★☆ (4)</option>
                      <option value={3}>★★★☆☆ (3)</option>
                      <option value={2}>★★☆☆☆ (2)</option>
                      <option value={1}>★☆☆☆☆ (1)</option>
                    </select>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          {t('common.loading')}
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane"></i> {t('testimonials.submit')}
                        </>
                      )}
                    </button>
                  </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Testimonial card component with scroll animation
interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  const scrollRef = useScrollAnimation({ threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <i
            key={i}
            className={`fas fa-star ${i < rating ? 'filled' : 'empty'}`}
          ></i>
        ))}
      </div>
    );
  };

  return (
    <div ref={scrollRef} className="col-md-6 col-lg-4">
      <div className="testimonial-card">
        <div className="testimonial-header">
          {testimonial.avatar && (
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              className="avatar"
            />
          )}
          <div className="testimonial-info">
            <h4 className="testimonial-name">{testimonial.name}</h4>
            <p className="testimonial-title">{testimonial.title}</p>
            <p className="testimonial-company">{testimonial.company}</p>
          </div>
        </div>
        {renderStars(testimonial.rating)}
        <p className="testimonial-message">"{testimonial.message}"</p>
      </div>
    </div>
  );
}

export default TestimonialsPage;