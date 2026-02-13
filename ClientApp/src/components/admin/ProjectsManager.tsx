import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useLanguage } from '../../contexts/LanguageContext';
import { ConfirmationModal } from '../../components/common';
import './ProjectsManager.css';

interface Project {
  id: number;
  titleEn: string;
  titleFr: string;
  descriptionEn: string;
  descriptionFr: string;
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    titleEn: '',
    titleFr: '',
    descriptionEn: '',
    descriptionFr: '',
    technologies: '',
    projectUrl: '',
    githubUrl: '',
    imageUrl: '',
    displayOrder: 0
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    id: 0
  });
  const authConfig = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err: any) {
      setError(language === 'en' ? 'Failed to load projects' : 'Échec du chargement des projets');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file is image
      if (!file.type.startsWith('image/')) {
        setError(language === 'en' ? 'Please select a valid image file' : 'Veuillez sélectionner un fichier image valide');
        return;
      }
      setImageFile(file);
      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      let imageUrl = formData.imageUrl;

      // Upload image if new file selected
      if (imageFile) {
        const formDataImage = new FormData();
        formDataImage.append('file', imageFile);
        
        const uploadResponse = await api.post('/api/upload/project-image', formDataImage, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        imageUrl = uploadResponse.data.imageUrl;
      }

      const projectData = {
        ...formData,
        imageUrl
      };

      if (editingId) {
        await api.put(`/projects/${editingId}`, projectData, authConfig);
        setSuccess(language === 'en' ? 'Project updated successfully!' : 'Projet mis à jour avec succès!');
      } else {
        await api.post('/projects', projectData, authConfig);
        setSuccess(language === 'en' ? 'Project added successfully!' : 'Projet ajouté avec succès!');
      }
      resetForm();
      fetchProjects();
    } catch (err: any) {
      setError(err.response?.data?.message || (language === 'en' ? 'Operation failed' : 'L\'opération a échoué'));
    }
  };

  const handleDelete = async (id: number) => {
    setConfirmDialog({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/projects/${confirmDialog.id}`, authConfig);
      setSuccess(language === 'en' ? 'Project deleted successfully!' : 'Projet supprimé avec succès!');
      fetchProjects();
      setConfirmDialog({ isOpen: false, id: 0 });
    } catch (err: any) {
      setError(err.response?.data?.message || (language === 'en' ? 'Delete failed' : 'La suppression a échoué'));
      setConfirmDialog({ isOpen: false, id: 0 });
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      titleEn: project.titleEn,
      titleFr: project.titleFr,
      descriptionEn: project.descriptionEn,
      descriptionFr: project.descriptionFr,
      technologies: project.technologies,
      projectUrl: project.projectUrl,
      githubUrl: project.githubUrl,
      imageUrl: project.imageUrl,
      displayOrder: project.displayOrder
    });
    setImagePreview(project.imageUrl);
    setImageFile(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      titleEn: '',
      titleFr: '',
      descriptionEn: '',
      descriptionFr: '',
      technologies: '',
      projectUrl: '',
      githubUrl: '',
      imageUrl: '',
      displayOrder: 0
    });
    setImageFile(null);
    setImagePreview('');
  };

  if (loading) return <div className="text-center"><div className="spinner-border"></div></div>;

  return (
    <div className="projects-manager">
      <h2><i className="fas fa-folder"></i> {t('admin.tabs.projects')} - {t('admin.manageSections')}</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <ConfirmationModal
        isOpen={confirmDialog.isOpen}
        title={language === 'en' ? 'Delete Project' : 'Supprimer le projet'}
        message={language === 'en' ? 'Are you sure you want to delete this project? This action cannot be undone.' : 'Êtes-vous sûr de vouloir supprimer ce projet? Cette action ne peut pas être annulée.'}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        isDangerous={true}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, id: 0 })}
      />

      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="project-form">
            <h4>{editingId ? (language === 'en' ? 'Edit Project' : 'Modifier le projet') : (language === 'en' ? 'Add Project' : 'Ajouter un projet')}</h4>

            <div className="mb-3">
              <label className="form-label">{language === 'en' ? 'Title (English)' : 'Titre (anglais)'} <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control"
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">{language === 'en' ? 'Title (French)' : 'Titre (français)'} <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control"
                value={formData.titleFr}
                onChange={(e) => setFormData({ ...formData, titleFr: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">{language === 'en' ? 'Description (English)' : 'Description (anglais)'} <span className="text-danger">*</span></label>
              <textarea
                className="form-control"
                value={formData.descriptionEn}
                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">{language === 'en' ? 'Description (French)' : 'Description (français)'} <span className="text-danger">*</span></label>
              <textarea
                className="form-control"
                value={formData.descriptionFr}
                onChange={(e) => setFormData({ ...formData, descriptionFr: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">{t('projects.technologies')}</label>
              <input
                type="text"
                className="form-control"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                placeholder={language === 'en' ? 'e.g., React, ASP.NET, TypeScript' : 'ex. React, ASP.NET, TypeScript'}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">{language === 'en' ? 'Project URL' : 'URL du projet'}</label>
              <input
                type="url"
                className="form-control"
                value={formData.projectUrl}
                onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">{language === 'en' ? 'GitHub URL' : 'URL GitHub'}</label>
              <input
                type="url"
                className="form-control"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">{language === 'en' ? 'Project Image (JPEG, PNG, etc.)' : 'Image du projet (JPEG, PNG, etc.)'}</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '8px' }} />
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">{language === 'en' ? 'Display Order' : 'Ordre d\'affichage'}</label>
              <input
                type="number"
                className="form-control"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
              />
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                {editingId ? t('common.edit') : (language === 'en' ? 'Add' : 'Ajouter')}
              </button>
              {editingId && (
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  {t('common.cancel')}
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="col-md-6">
          <h4>{language === 'en' ? 'Current Projects' : 'Projets actuels'}</h4>
          <div className="projects-list">
            {projects.map(project => (
              <div key={project.id} className="project-card">
                {project.imageUrl && (
                  <img src={project.imageUrl} alt={language === 'fr' ? project.titleFr : project.titleEn} className="project-image" />
                )}
                <div className="project-info">
                  <h5>{language === 'fr' ? project.titleFr : project.titleEn}</h5>
                  <p className="text-muted small">{project.technologies}</p>
                  <div className="project-actions">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleEdit(project)}
                    >
                      <i className="fas fa-edit"></i> {t('common.edit')}
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(project.id)}
                    >
                      <i className="fas fa-trash"></i> {t('common.delete')}
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
