import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useLanguage } from '../../contexts/LanguageContext';
import './WorkExperienceManager.css';

interface WorkExperience {
  id: number;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  displayOrder: number;
}

function WorkExperienceManager() {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<WorkExperience, 'id'>>({
    company: '',
    position: '',
    description: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    displayOrder: 0
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { t } = useLanguage();
  const authConfig = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const response = await api.get('/work-experience');
      setExperiences(response.data);
    } catch (err: any) {
      setError('Failed to load experiences');
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
        await api.put(`/work-experience/${editingId}`, formData, authConfig);
        setSuccess('Experience updated successfully!');
      } else {
        await api.post('/work-experience', formData, authConfig);
        setSuccess('Experience added successfully!');
      }
      resetForm();
      fetchExperiences();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      await api.delete(`/work-experience/${id}`, authConfig);
      setSuccess('Experience deleted successfully!');
      fetchExperiences();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleEdit = (exp: WorkExperience) => {
    setEditingId(exp.id);
    setFormData({
      company: exp.company,
      position: exp.position,
      description: exp.description,
      startDate: exp.startDate,
      endDate: exp.endDate,
      isCurrent: exp.isCurrent,
      displayOrder: exp.displayOrder
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      company: '',
      position: '',
      description: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      displayOrder: 0
    });
  };

  if (loading) return <div className="text-center"><div className="spinner-border"></div></div>;

  return (
    <div className="experience-manager">
      <h2><i className="fas fa-briefcase"></i> Manage Work Experience</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="experience-form">
            <h4>{editingId ? 'Edit Experience' : 'Add New Experience'}</h4>

            <div className="mb-3">
              <label className="form-label">Company (EN)</label>
              <input
                type="text"
                className="form-control"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Position</label>
              <input
                type="text"
                className="form-control"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    disabled={formData.isCurrent}
                  />
                </div>
              </div>
            </div>

            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="isCurrent"
                checked={formData.isCurrent}
                onChange={(e) => setFormData({
                  ...formData,
                  isCurrent: e.target.checked,
                  endDate: e.target.checked ? '' : formData.endDate
                })}
              />
              <label className="form-check-label" htmlFor="isCurrent">
                Currently working here
              </label>
            </div>

            <div className="mb-3">
              <label className="form-label">Display Order</label>
              <input
                type="number"
                className="form-control"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
              />
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update' : 'Add'} Experience
              </button>
              {editingId && (
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="col-md-6">
          <h4>Timeline</h4>
          <div className="timeline">
            {experiences.map(exp => (
              <div key={exp.id} className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h5>{exp.positionEn}</h5>
                  <p className="company">{exp.companyEn}</p>
                  <p className="dates">
                    {new Date(exp.startDate).toLocaleDateString()} - {' '}
                    {exp.isCurrent ? <span className="badge bg-success">Current</span> : new Date(exp.endDate).toLocaleDateString()}
                  </p>
                  <div className="actions">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleEdit(exp)}
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(exp.id)}
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkExperienceManager;
