import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useLanguage } from '../../contexts/LanguageContext';
import { ConfirmationModal } from '../../components/common';
import './WorkExperienceManager.css';

interface WorkExperience {
  id: number;
  company: string;
  companyFr?: string;
  position: string;
  positionFr?: string;
  description: string;
  descriptionFr?: string;
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
    companyFr: '',
    position: '',
    positionFr: '',
    description: '',
    descriptionFr: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
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
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const response = await api.get('/work-experience');
      setExperiences(response.data);
    } catch (err: any) {
      setError(language === 'en' ? 'Failed to load experiences' : 'Échec du chargement des expériences');
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
        setSuccess(language === 'en' ? 'Experience updated successfully!' : 'Expérience mise à jour avec succès!');
      } else {
        await api.post('/work-experience', formData, authConfig);
        setSuccess(language === 'en' ? 'Experience added successfully!' : 'Expérience ajoutée avec succès!');
      }
      resetForm();
      fetchExperiences();
    } catch (err: any) {
      setError(err.response?.data?.message || (language === 'en' ? 'Operation failed' : 'L\'opération a échoué'));
    }
  };

  const handleDelete = async (id: number) => {
    setConfirmDialog({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/work-experience/${confirmDialog.id}`, authConfig);
      setSuccess(language === 'en' ? 'Experience deleted successfully!' : 'Expérience supprimée avec succès!');
      fetchExperiences();
      setConfirmDialog({ isOpen: false, id: 0 });
    } catch (err: any) {
      setError(err.response?.data?.message || (language === 'en' ? 'Delete failed' : 'La suppression a échoué'));
      setConfirmDialog({ isOpen: false, id: 0 });
    }
  };

  const handleEdit = (exp: WorkExperience) => {
    setEditingId(exp.id);
    setFormData({
      company: exp.company,
      companyFr: exp.companyFr || '',
      position: exp.position,
      positionFr: exp.positionFr || '',
      description: exp.description,
      descriptionFr: exp.descriptionFr || '',
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
      companyFr: '',
      position: '',
      positionFr: '',
      description: '',
      descriptionFr: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      displayOrder: 0
    });
  };

  if (loading) return <div className="text-center"><div className="spinner-border"></div></div>;

  return (
    <div className="experience-manager">
      <h2><i className="fas fa-briefcase"></i> {t('admin.tabs.experience')} - {t('admin.manageSections')}</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <ConfirmationModal
        isOpen={confirmDialog.isOpen}
        title={language === 'en' ? 'Delete Experience' : 'Supprimer l\'expérience'}
        message={language === 'en' ? 'Are you sure you want to delete this work experience entry? This action cannot be undone.' : 'Êtes-vous sûr de vouloir supprimer cette entrée d\'expérience de travail? Cette action ne peut pas être annulée.'}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        isDangerous={true}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, id: 0 })}
      />

      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="experience-form">
            <h4>{editingId ? (language === 'en' ? 'Edit Experience' : 'Modifier l\'expérience') : (language === 'en' ? 'Add Experience' : 'Ajouter une expérience')}</h4>

            <div className="mb-3">
              <label className="form-label">{language === 'en' ? 'Company (EN)' : 'Entreprise (EN)'}</label>
              <input
                type="text"
                className="form-control"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">{language === 'en' ? 'Company (French)' : 'Entreprise (français)'}</label>
              <input
                type="text"
                className="form-control"
                value={formData.companyFr}
                onChange={(e) => setFormData({ ...formData, companyFr: e.target.value })}
                placeholder={language === 'en' ? 'Optional French translation' : 'Traduction française optionnelle'}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">{language === 'en' ? 'Position' : 'Poste'}</label>
              <input
                type="text"
                className="form-control"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">{language === 'en' ? 'Position (French)' : 'Poste (français)'}</label>
              <input
                type="text"
                className="form-control"
                value={formData.positionFr}
                onChange={(e) => setFormData({ ...formData, positionFr: e.target.value })}
                placeholder={language === 'en' ? 'Optional French translation' : 'Traduction française optionnelle'}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">{t('projects.description')}</label>
              <textarea
                className="form-control"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">{t('projects.description')} (Français)</label>
              <textarea
                className="form-control"
                value={formData.descriptionFr}
                onChange={(e) => setFormData({ ...formData, descriptionFr: e.target.value })}
                rows={2}
                placeholder={language === 'en' ? 'Optional French translation' : 'Traduction française optionnelle'}
              />
            </div>

            <div className="row">
              <div className="col-md-6">
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
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">{language === 'en' ? 'End Date' : 'Date de fin'}</label>
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
                {language === 'en' ? 'Currently working here' : 'Actuellement en poste'}
              </label>
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
          <h4>{language === 'en' ? 'Timeline' : 'Chronologie'}</h4>
          <div className="timeline">
            {experiences.map(exp => {
              const displayPosition = language === 'fr' && exp.positionFr ? exp.positionFr : exp.position;
              const displayCompany = language === 'fr' && exp.companyFr ? exp.companyFr : exp.company;
              const displayDescription = language === 'fr' && exp.descriptionFr ? exp.descriptionFr : exp.description;

              return (
              <div key={exp.id} className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h5>{displayPosition}</h5>
                  <p className="company">{displayCompany}</p>
                  {displayDescription && <small className="text-muted d-block mb-1">{displayDescription}</small>}
                  <p className="dates">
                    {new Date(exp.startDate).toLocaleDateString()} - {' '}
                    {exp.isCurrent ? <span className="badge bg-success">{language === 'en' ? 'Current' : 'Actuel'}</span> : new Date(exp.endDate).toLocaleDateString()}
                  </p>
                  <div className="actions">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleEdit(exp)}
                    >
                      <i className="fas fa-edit"></i> {t('common.edit')}
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(exp.id)}
                    >
                      <i className="fas fa-trash"></i> {t('common.delete')}
                    </button>
                  </div>
                </div>
              </div>
            )})}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkExperienceManager;
