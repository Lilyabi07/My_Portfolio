import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Testimonial, 'id' | 'submittedDate'>>({
    name: '',
    title: '',
    company: '',
    message: '',
    avatar: '',
    rating: 5,
    isPublished: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/testimonials/admin/all', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
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

    try {
      if (editingId) {
        await axios.put(`/api/testimonials/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setSuccess('Testimonial updated successfully!');
      } else {
        await axios.post('/api/testimonials', formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setSuccess('Testimonial added successfully!');
      }
      resetForm();
      fetchTestimonials();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handlePublish = async (id: number) => {
    try {
      await axios.put(`/api/testimonials/${id}/publish`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess('Testimonial published!');
      fetchTestimonials();
    } catch (err: any) {
      setError('Failed to publish testimonial');
    }
  };

  const handleUnpublish = async (id: number) => {
    try {
      await axios.put(`/api/testimonials/${id}/unpublish`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess('Testimonial unpublished!');
      fetchTestimonials();
    } catch (err: any) {
      setError('Failed to unpublish testimonial');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      await axios.delete(`/api/testimonials/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess('Testimonial deleted successfully!');
      fetchTestimonials();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id);
    setFormData({
      name: testimonial.name,
      title: testimonial.title,
      company: testimonial.company,
      message: testimonial.message,
      avatar: testimonial.avatar || '',
      rating: testimonial.rating || 5,
      isPublished: testimonial.isPublished
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      title: '',
      company: '',
      message: '',
      avatar: '',
      rating: 5,
      isPublished: false
    });
  };

  const pendingTestimonials = testimonials.filter(t => !t.isPublished);
  const publishedTestimonials = testimonials.filter(t => t.isPublished);

  if (loading) return <div className="text-center"><div className="spinner-border"></div></div>;

  return (
    <div className="testimonials-manager">
      <h2><i className="fas fa-comments"></i> Manage Testimonials</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

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
                      className="btn btn-sm btn-warning"
                      onClick={() => handleEdit(testimonial)}
                    >
                      <i className="fas fa-edit"></i> Edit
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
                      className="btn btn-sm btn-info"
                      onClick={() => handleEdit(testimonial)}
                    >
                      <i className="fas fa-edit"></i> Edit
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

      {/* Edit Form */}
      {editingId && (
        <div className="edit-form-section">
          <h4>Edit Testimonial</h4>
          <form onSubmit={handleSubmit} className="testimonial-form">
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Company</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea
                className="form-control"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Rating</label>
                <select
                  className="form-select"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} Stars</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Avatar URL</label>
                <input
                  type="url"
                  className="form-control"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                />
              </div>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                Update Testimonial
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default TestimonialsManager;
