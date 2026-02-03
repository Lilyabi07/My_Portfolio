import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProjectsManager.css';

interface Project {
  id: number;
  titleEn: string;
  titleEs: string;
  descriptionEn: string;
  descriptionEs: string;
  technologies: string;
  projectUrl: string;
  githubUrl: string;
  imageUrl: string;
  displayOrder: number;
}

function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    titleEn: '',
    titleEs: '',
    descriptionEn: '',
    descriptionEs: '',
    technologies: '',
    projectUrl: '',
    githubUrl: '',
    imageUrl: '',
    displayOrder: 0
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/projects');
      setProjects(response.data);
    } catch (err: any) {
      setError('Failed to load projects');
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
        await axios.put(`/api/projects/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setSuccess('Project updated successfully!');
      } else {
        await axios.post('/api/projects', formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setSuccess('Project added successfully!');
      }
      resetForm();
      fetchProjects();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      await axios.delete(`/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess('Project deleted successfully!');
      fetchProjects();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      titleEn: project.titleEn,
      titleEs: project.titleEs,
      descriptionEn: project.descriptionEn,
      descriptionEs: project.descriptionEs,
      technologies: project.technologies,
      projectUrl: project.projectUrl,
      githubUrl: project.githubUrl,
      imageUrl: project.imageUrl,
      displayOrder: project.displayOrder
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      titleEn: '',
      titleEs: '',
      descriptionEn: '',
      descriptionEs: '',
      technologies: '',
      projectUrl: '',
      githubUrl: '',
      imageUrl: '',
      displayOrder: 0
    });
  };

  if (loading) return <div className="text-center"><div className="spinner-border"></div></div>;

  return (
    <div className="projects-manager">
      <h2><i className="fas fa-folder"></i> Manage Projects</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="project-form">
            <h4>{editingId ? 'Edit Project' : 'Add New Project'}</h4>

            <div className="mb-3">
              <label className="form-label">Title (EN)</label>
              <input
                type="text"
                className="form-control"
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Title (ES)</label>
              <input
                type="text"
                className="form-control"
                value={formData.titleEs}
                onChange={(e) => setFormData({ ...formData, titleEs: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description (EN)</label>
              <textarea
                className="form-control"
                value={formData.descriptionEn}
                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description (ES)</label>
              <textarea
                className="form-control"
                value={formData.descriptionEs}
                onChange={(e) => setFormData({ ...formData, descriptionEs: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Technologies</label>
              <input
                type="text"
                className="form-control"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                placeholder="e.g., React, ASP.NET, TypeScript"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Project URL</label>
              <input
                type="url"
                className="form-control"
                value={formData.projectUrl}
                onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">GitHub URL</label>
              <input
                type="url"
                className="form-control"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Image URL</label>
              <input
                type="url"
                className="form-control"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
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
                {editingId ? 'Update' : 'Add'} Project
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
          <h4>Current Projects</h4>
          <div className="projects-list">
            {projects.map(project => (
              <div key={project.id} className="project-card">
                {project.imageUrl && (
                  <img src={project.imageUrl} alt={project.titleEn} className="project-image" />
                )}
                <div className="project-info">
                  <h5>{project.titleEn}</h5>
                  <p className="text-muted small">{project.technologies}</p>
                  <div className="project-actions">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleEdit(project)}
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(project.id)}
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

export default ProjectsManager;
