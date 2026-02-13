import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useLanguage } from '../../contexts/LanguageContext';
import { ConfirmationModal } from '../../components/common';
import './EducationManager.css';

interface Education {
  id: number;
  institution: string;
  institutionFr?: string;
  degree: string;
  degreeFr?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  descriptionFr?: string;
  displayOrder: number;
}

function EducationManager() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Education, 'id'>>({
    institution: '',
    institutionFr: '',
    degree: '',
    degreeFr: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: undefined,
    isCurrent: false,
    description: '',
    descriptionFr: '',
    displayOrder: 0
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    id: 0
  });
  const { t, language } = useLanguage();
  const authConfig = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` }
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/education');
      setEducations(response.data);
    } catch (err: any) {
      setError(language === 'en' ? 'Failed to load education' : 'Échec du chargement de l\'éducation');
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
        await api.put(`/education/${editingId}`, formData, authConfig);
        setSuccess(language === 'en' ? 'Education updated successfully!' : 'Éducation mise à jour avec succès!');
      } else {
        await api.post('/education', formData, authConfig);
        setSuccess(language === 'en' ? 'Education added successfully!' : 'Éducation ajoutée avec succès!');
      }
      resetForm();
      fetchEducations();
    } catch (err: any) {
      setError(err.response?.data?.message || (language === 'en' ? 'Operation failed' : 'L\'opération a échoué'));
    }
  };

  const handleDelete = async (id: number) => {
    setConfirmDialog({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/education/${confirmDialog.id}`, authConfig);
      setSuccess(language === 'en' ? 'Education deleted successfully!' : 'Éducation supprimée avec succès!');
      fetchEducations();
      setConfirmDialog({ isOpen: false, id: 0 });
    } catch (err: any) {
      setError(err.response?.data?.message || (language === 'en' ? 'Delete failed' : 'La suppression a échoué'));
      setConfirmDialog({ isOpen: false, id: 0 });
    }
  };

  const handleEdit = (education: Education) => {
    setEditingId(education.id);
    setFormData({
      institution: education.institution,
      institutionFr: education.institutionFr || '',
      degree: education.degree,
      degreeFr: education.degreeFr || '',
      startDate: education.startDate.split('T')[0],
      endDate: education.endDate ? education.endDate.split('T')[0] : undefined,
      isCurrent: education.isCurrent,
      description: education.description,
      descriptionFr: education.descriptionFr || '',
      displayOrder: education.displayOrder
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      institution: '',
      institutionFr: '',
      degree: '',
      degreeFr: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: undefined,
      isCurrent: false,
      description: '',
      descriptionFr: '',
      displayOrder: 0
    });
  };

  if (loading) return <div className="text-center"><div className="spinner-border"></div></div>;

  return (
    <div className="education-manager">
      <h2><i className="fas fa-graduation-cap"></i> {t('admin.tabs.education')} - {t('admin.manageSections')}</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <ConfirmationModal
        isOpen={confirmDialog.isOpen}
        title={language === 'en' ? 'Delete Education' : 'Supprimer l\'éducation'}
        message={language === 'en' ? 'Are you sure you want to delete this education entry? This action cannot be undone.' : 'Êtes-vous sûr de vouloir supprimer cette entrée éducation? Cette action ne peut pas être annulée.'}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        isDangerous={true}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, id: 0 })}
      />

      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="education-form">
            <h4>{editingId ? (language === 'en' ? 'Edit Education' : 'Modifier l\'éducation') : (language === 'en' ? 'Add Education' : 'Ajouter une formation')}</h4>

            <div className="mb-3">
              <label className="form-label">{language === 'en' ? 'Degree/Certification' : 'Diplôme/Certification'}</label>
              <input
                type="text"
                className="form-control"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="e.g., Bachelor of Science"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">{language === 'en' ? 'Degree/Certification (French)' : 'Diplôme/Certification (français)'}</label>
              <input
                type="text"
                className="form-control"
                value={formData.degreeFr}
                onChange={(e) => setFormData({ ...formData, degreeFr: e.target.value })}
                placeholder="e.g., Baccalauréat en sciences"
              />
              <small className="text-muted">{language === 'en' ? 'Optional: French translation of the degree' : 'Optionnel : traduction française du diplôme'}</small>
            </div>

            <div className="mb-3">
              <label className="form-label">{language === 'en' ? 'Institution' : 'Institution'}</label>
              <input
                type="text"
                className="form-control"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="e.g., University Name"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">{language === 'en' ? 'Institution (French)' : 'Institution (français)'}</label>
              <input
                type="text"
                className="form-control"
                value={formData.institutionFr}
                onChange={(e) => setFormData({ ...formData, institutionFr: e.target.value })}
                placeholder="e.g., Nom de l'université"
              />
              <small className="text-muted">{language === 'en' ? 'Optional: French translation of the institution name' : 'Optionnel : traduction française du nom de l\'institution'}</small>
            </div>

            <div className="mb-3">
              <label className="form-label">{language === 'en' ? 'Start Date' : 'Date de début'}</label>
              <input
                type="date"
                className="form-control"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <div className="form-check mb-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="isCurrent"
                  checked={formData.isCurrent}
                  onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                />
                <label className="form-check-label" htmlFor="isCurrent">
                  {language === 'en' ? 'Currently studying' : 'Actuellement étudiant'}
                </label>
              </div>
            </div>

            {!formData.isCurrent && (
              <div className="mb-3">
                <label className="form-label">{language === 'en' ? 'End Date' : 'Date de fin'}</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.endDate || ''}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value || undefined })}
                />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">{t('projects.description')}</label>
              <textarea
                className="form-control"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={language === 'en' ? 'Additional details about your education...' : 'Détails supplémentaires sur votre éducation...'}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">{t('projects.description')} (Français)</label>
              <textarea
                className="form-control"
                rows={3}
                value={formData.descriptionFr}
                onChange={(e) => setFormData({ ...formData, descriptionFr: e.target.value })}
                placeholder="Détails supplémentaires sur votre éducation..."
              />
              <small className="text-muted">{language === 'en' ? 'Optional: French translation of the description' : 'Optionnel : traduction française de la description'}</small>
            </div>

            <div className="mb-3">
              <label className="form-label">{language === 'en' ? 'Display Order' : 'Ordre d\'affichage'}</label>
              <input
                type="number"
                className="form-control"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value, 10) })}
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
          <h4>{editingId ? (language === 'en' ? 'Edit Education' : 'Modifier l\'éducation') : (language === 'en' ? 'Current Education' : 'Éducation actuelle')}</h4>
          <div className="education-list">
            {educations.map((education) => (
              <div key={education.id} className="education-item">
                <div className="education-info">
                  <div className="education-names">
                    <strong>{language === 'fr' && education.degreeFr ? education.degreeFr : education.degree}</strong>
                    <span className="institution">{language === 'fr' && education.institutionFr ? education.institutionFr : education.institution}</span>
                  </div>
                  <div className="education-dates">
                    <small>
                      {new Date(education.startDate).toLocaleDateString()} 
                      {education.isCurrent ? (language === 'en' ? ' - Present' : ' - Présent') : education.endDate ? ` - ${new Date(education.endDate).toLocaleDateString()}` : ''}
                    </small>
                  </div>
                  {education.isCurrent && (
                    <span className="badge bg-success ms-2">{language === 'en' ? 'Current' : 'Actuel'}</span>
                  )}
                </div>
                <div className="education-actions">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => handleEdit(education)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(education.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
            {educations.length === 0 && (
              <div className="text-center text-muted py-3">
                <p>{language === 'en' ? 'No education entries yet. Add one above!' : 'Aucune entrée d\'éducation pour l\'instant. Ajoutez-en une ci-dessus!'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EducationManager;
