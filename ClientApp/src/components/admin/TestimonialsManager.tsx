import React, { useState, useEffect } from 'react';
import api from '../../api';
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
      setError('Failed to load testimonials');
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
      setSuccess('Testimonial published!');
      fetchTestimonials();
    } catch (err: any) {
      setError('Failed to publish testimonial');
    }
  };

  const handleUnpublish = async (id: number) => {
    try {
      await api.put(`/testimonials/${id}/unpublish`, {}, authConfig);
      setSuccess('Testimonial unpublished!');
      fetchTestimonials();
    } catch (err: any) {
      setError('Failed to unpublish testimonial');
    }
  };

  const handleDelete = async (id: number) => {
    setConfirmDialog({ isOpen: true, id, action: 'delete' });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/testimonials/${confirmDialog.id}`, authConfig);
      setSuccess('Testimonial deleted successfully!');
      fetchTestimonials();
      setConfirmDialog({ isOpen: false, id: 0, action: 'delete' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Delete failed');
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
      <h2><i className="fas fa-comments"></i> Manage Testimonials</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <ConfirmationModal
        isOpen={confirmDialog.isOpen}
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
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
            Pending Review ({pendingTestimonials.length})
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
            Published ({publishedTestimonials.length})
          </button>
        </li>
      </ul>

      <div className="tab-content">
        {/* Pending Testimonials */}
        <div className="tab-pane fade show active" id="pending" role="tabpanel">
          {pendingTestimonials.length === 0 ? (
            <div className="alert alert-info">No pending testimonials</div>
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
                      <p className="meta">{testimonial.title} at {testimonial.company}</p>
                      <p className="date">Submitted: {new Date(testimonial.submittedDate).toLocaleDateString()}</p>
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
                      <i className="fas fa-check"></i> Approve & Publish
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(testimonial.id)}
                    >
                      <i className="fas fa-trash"></i> Reject
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
            <div className="alert alert-info">No published testimonials</div>
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
                      <p className="meta">{testimonial.title} at {testimonial.company}</p>
                      <p className="date">Published: {new Date(testimonial.submittedDate).toLocaleDateString()}</p>
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
                      <i className="fas fa-eye-slash"></i> Unpublish
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(testimonial.id)}
                    >
                      <i className="fas fa-trash"></i> Delete
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
