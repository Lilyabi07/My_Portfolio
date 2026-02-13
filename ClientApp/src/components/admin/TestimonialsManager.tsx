import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useLanguage } from '../../contexts/LanguageContext';
import { ConfirmationModal } from '../../components/common';
import './TestimonialsManager.css';

interface Testimonial {
  id: number;
  name: string;
  title: string;
  company: string;
  message: string;
  avatar?: string;
  rating?: number;
  isPublished: boolean;
  submittedDate: string;
}

function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    id: 0,
    action: 'delete'
  });
  const { t, language } = useLanguage();
  const authConfig = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await api.get('/testimonials/admin/all', authConfig);
      setTestimonials(response.data);
    } catch (err: any) {
      setError(language === 'en' ? 'Failed to load testimonials' : 'Échec du chargement des témoignages');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Edit functionality removed - testimonials can only be created via the public form
    // This component is now for review/publish/unpublish/delete only
  };

  const handlePublish = async (id: number) => {
    try {
      await api.put(`/testimonials/${id}/publish`, {}, authConfig);
      setSuccess(language === 'en' ? 'Testimonial published!' : 'Témoignage publié!');
      fetchTestimonials();
    } catch (err: any) {
      setError(language === 'en' ? 'Failed to publish testimonial' : 'Échec de la publication du témoignage');
    }
  };

  const handleUnpublish = async (id: number) => {
    try {
      await api.put(`/testimonials/${id}/unpublish`, {}, authConfig);
      setSuccess(language === 'en' ? 'Testimonial unpublished!' : 'Témoignage dépublié!');
      fetchTestimonials();
    } catch (err: any) {
      setError(language === 'en' ? 'Failed to unpublish testimonial' : 'Échec de la dépublication du témoignage');
    }
  };

  const handleDelete = async (id: number) => {
    setConfirmDialog({ isOpen: true, id, action: 'delete' });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/testimonials/${confirmDialog.id}`, authConfig);
      setSuccess(language === 'en' ? 'Testimonial deleted successfully!' : 'Témoignage supprimé avec succès!');
      fetchTestimonials();
      setConfirmDialog({ isOpen: false, id: 0, action: 'delete' });
    } catch (err: any) {
      setError(err.response?.data?.message || (language === 'en' ? 'Delete failed' : 'La suppression a échoué'));
      setConfirmDialog({ isOpen: false, id: 0, action: 'delete' });
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    // Edit functionality has been removed
    // Testimonials can only be created via the public form
  };

  const resetForm = () => {
    // Reset form functionality removed with edit capability
  };

  const pendingTestimonials = testimonials.filter(t => !t.isPublished);
  const publishedTestimonials = testimonials.filter(t => t.isPublished);

  if (loading) return <div className="text-center"><div className="spinner-border"></div></div>;

  return (
    <div className="testimonials-manager">
      <h2><i className="fas fa-comments"></i> {t('admin.tabs.testimonials')} - {t('admin.manageSections')}</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <ConfirmationModal
        isOpen={confirmDialog.isOpen}
        title={language === 'en' ? 'Delete Testimonial' : 'Supprimer le témoignage'}
        message={language === 'en' ? 'Are you sure you want to delete this testimonial? This action cannot be undone.' : 'Êtes-vous sûr de vouloir supprimer ce témoignage? Cette action ne peut pas être annulée.'}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        isDangerous={true}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, id: 0, action: 'delete' })}
      />

      <ul className="nav nav-tabs mb-4" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="pending-tab"
            data-bs-toggle="tab"
            data-bs-target="#pending"
            type="button"
            role="tab"
          >
            {language === 'en' ? 'Pending Review' : 'En attente d\'examen'} ({pendingTestimonials.length})
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="published-tab"
            data-bs-toggle="tab"
            data-bs-target="#published"
            type="button"
            role="tab"
          >
            {language === 'en' ? 'Published' : 'Publié'} ({publishedTestimonials.length})
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {/* Pending Testimonials */}
        <div className="tab-pane fade show active" id="pending" role="tabpanel">
          {pendingTestimonials.length === 0 ? (
            <div className="alert alert-info">{language === 'en' ? 'No pending testimonials' : 'Aucun témoignage en attente'}</div>
          ) : (
            <div className="testimonials-list">
              {pendingTestimonials.map(testimonial => (
                <div key={testimonial.id} className="testimonial-card pending">
                  <div className="testimonial-header">
                    {testimonial.avatar && (
                      <img src={testimonial.avatar} alt={testimonial.name} className="avatar" />
                    )}
                    <div className="testimonial-info">
                      <h5>{testimonial.name}</h5>
                      <p className="meta">{testimonial.title} {language === 'en' ? 'at' : 'chez'} {testimonial.company}</p>
                      <p className="date">{language === 'en' ? 'Submitted:' : 'Soumis :'} {new Date(testimonial.submittedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {testimonial.rating && (
                    <div className="stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <i key={i} className={`fas fa-star ${i < testimonial.rating! ? 'filled' : 'empty'}`}></i>
                      ))}
                    </div>
                  )}
                  <p className="message">"{testimonial.message}"</p>
                  <div className="actions">
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handlePublish(testimonial.id)}
                    >
                      <i className="fas fa-check"></i> {language === 'en' ? 'Approve & Publish' : 'Approuver et publier'}
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(testimonial.id)}
                    >
                      <i className="fas fa-trash"></i> {language === 'en' ? 'Reject' : 'Rejeter'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Published Testimonials */}
        <div className="tab-pane fade" id="published" role="tabpanel">
          {publishedTestimonials.length === 0 ? (
            <div className="alert alert-info">{language === 'en' ? 'No published testimonials' : 'Aucun témoignage publié'}</div>
          ) : (
            <div className="testimonials-list">
              {publishedTestimonials.map(testimonial => (
                <div key={testimonial.id} className="testimonial-card published">
                  <div className="testimonial-header">
                    {testimonial.avatar && (
                      <img src={testimonial.avatar} alt={testimonial.name} className="avatar" />
                    )}
                    <div className="testimonial-info">
                      <h5>{testimonial.name}</h5>
                      <p className="meta">{testimonial.title} {language === 'en' ? 'at' : 'chez'} {testimonial.company}</p>
                      <p className="date">{language === 'en' ? 'Published:' : 'Publié :'} {new Date(testimonial.submittedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {testimonial.rating && (
                    <div className="stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <i key={i} className={`fas fa-star ${i < testimonial.rating! ? 'filled' : 'empty'}`}></i>
                      ))}
                    </div>
                  )}
                  <p className="message">"{testimonial.message}"</p>
                  <div className="actions">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleUnpublish(testimonial.id)}
                    >
                      <i className="fas fa-eye-slash"></i> {language === 'en' ? 'Unpublish' : 'Dépublier'}
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(testimonial.id)}
                    >
                      <i className="fas fa-trash"></i> {language === 'en' ? 'Delete' : 'Supprimer'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TestimonialsManager;
