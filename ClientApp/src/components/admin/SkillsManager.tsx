import React, { useState, useEffect } from 'react';
import api from '../../api';
import './SkillsManager.css';

interface Skill {
  id: number;
  name: string;
  proficiency: number;
  icon: string;
  displayOrder: number;
}

function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Skill, 'id'>>({
    name: '',
    proficiency: 0,
    icon: '',
    displayOrder: 0
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const authConfig = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await api.get('/skills');
      setSkills(response.data);
    } catch (err: any) {
      setError('Failed to load skills');
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
        await api.put(`/skills/${editingId}`, formData, authConfig);
        setSuccess('Skill updated successfully!');
      } else {
        await api.post('/skills', formData, authConfig);
        setSuccess('Skill added successfully!');
      }
      resetForm();
      fetchSkills();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      await api.delete(`/skills/${id}`, authConfig);
      setSuccess('Skill deleted successfully!');
      fetchSkills();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setFormData({
      name: skill.name,
      proficiency: skill.proficiency,
      icon: skill.icon,
      displayOrder: skill.displayOrder
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      proficiency: 0,
      icon: '',
      displayOrder: 0
    });
  };

  if (loading) return <div className="text-center"><div className="spinner-border"></div></div>;

  return (
    <div className="skills-manager">
      <h2><i className="fas fa-star"></i> Manage Skills</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="skill-form">
            <h4>{editingId ? 'Edit Skill' : 'Add New Skill'}</h4>

            <div className="mb-3">
              <label className="form-label">Skill Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Proficiency (%)</label>
              <input
                type="number"
                className="form-control"
                min="0"
                max="100"
                value={formData.proficiency}
                onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value, 10) })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Font Awesome Icon (e.g., fa-code)</label>
              <input
                type="text"
                className="form-control"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="fa-code"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Display Order</label>
              <input
                type="number"
                className="form-control"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value, 10) })}
              />
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update' : 'Add'} Skill
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
          <h4>Current Skills</h4>
          <div className="skills-list">
            {skills.map((skill) => (
              <div key={skill.id} className="skill-item">
                <div className="skill-info">
                  <div className="skill-names">
                    <strong>{skill.name}</strong>
                  </div>
                  <div className="skill-percentage">
                    <div className="progress" style={{ height: '20px' }}>
                      <div
                        className="progress-bar"
                        style={{ width: `${skill.proficiency}%` }}
                      >
                        {skill.proficiency}%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="skill-actions">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => handleEdit(skill)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(skill.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkillsManager;
