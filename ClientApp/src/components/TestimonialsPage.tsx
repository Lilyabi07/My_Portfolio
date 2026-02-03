import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from './Navigation';
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
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    message: '',
    rating: 5
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/testimonials');
      if (Array.isArray(response.data)) {
        setTestimonials(response.data);
      } else {
        setError('Invalid data format received');
      }
    } catch (err) {
      setError('Failed to load testimonials. Please try again later.');
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      await axios.post('/api/testimonials', formData);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        title: '',
        company: '',
        message: '',
        rating: 5
      });
      setTimeout(() => {
        setShowModal(false);
        setSubmitSuccess(false);
        setShowSuccessPopup(true);
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
    <div className="testimonials-page">
      <Navigation onAdminClick={onAdminClick} />
      
      {/* Success Notification Popup */}
      {showSuccessPopup && (
        <div className="success-notification-popup">
          <div className="notification-content">
            <div className="notification-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h3>Testimonial Submitted!</h3>
            <p>Thank you for sharing your experience. Your testimonial has been received and will be reviewed by our admin before appearing on the site.</p>
            <button 
              className="btn btn-sm btn-outline-light"
              onClick={() => setShowSuccessPopup(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}
      
      <section className="testimonials-hero">
        <button 
          className="btn-back-testimonials" 
          onClick={() => navigate('/')}
          title="Back to homepage"
        >
          <i className="fas fa-arrow-left"></i> Back to Home
        </button>
        <div className="testimonials-hero-content">
          <h1>Testimonials</h1>
          <p>What clients and colleagues have to say about my work</p>
        </div>
      </section>

      <section className="testimonials-list">
        <div className="container py-5">
          <div className="text-center mb-5">
            <button
              className="btn btn-lg btn-success"
              onClick={() => setShowModal(true)}
            >
              <i className="fas fa-plus"></i> Share Your Testimonial
            </button>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Loading testimonials...</p>
            </div>
          ) : error ? (
            <div className="alert alert-info" role="alert">
              {error}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="alert alert-info" role="alert">
              No testimonials available at this time. Be the first to share one!
            </div>
          ) : (
            <div className="row g-4">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="col-md-6 col-lg-4">
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
              ))}
            </div>
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
                <i className="fas fa-star"></i> Share Your Testimonial
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {submitSuccess ? (
                <div className="alert alert-success" role="alert">
                  <i className="fas fa-check-circle"></i> Thank you! Your testimonial has been submitted successfully.
                  It will appear on the site once reviewed and approved by the admin.
                </div>
              ) : (
                <>
                  {submitError && (
                    <div className="alert alert-danger" role="alert">
                      <i className="fas fa-exclamation-circle"></i> {submitError}
                    </div>
                  )}
                  <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Your Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="e.g., John Doe"
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="title" className="form-label">
                        Your Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        placeholder="e.g., Project Manager"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="company" className="form-label">
                        Company <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        required
                        placeholder="e.g., Tech Company Inc."
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="message" className="form-label">
                      Your Testimonial <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      required
                      placeholder="Share your experience working with me..."
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="rating" className="form-label">
                      Rating <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="rating"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    >
                      <option value={5}>Excellent (5)</option>
                      <option value={4}>Very Good (4)</option>
                      <option value={3}>Good (3)</option>
                      <option value={2}>Fair (2)</option>
                      <option value={1}>Poor (1)</option>
                    </select>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane"></i> Submit Testimonial
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

export default TestimonialsPage;
