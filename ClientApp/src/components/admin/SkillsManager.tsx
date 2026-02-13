import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useLanguage } from '../../contexts/LanguageContext';
import { ConfirmationModal } from '../../components/common';
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
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    id: 0
  });
  const { t, language } = useLanguage();
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
      setError(language === 'en' ? 'Failed to load skills' : 'Échec du chargement des compétences');
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
        setSuccess(language === 'en' ? 'Skill updated successfully!' : 'Compétence mise à jour avec succès!');
      } else {
        await api.post('/skills', formData, authConfig);
        setSuccess(language === 'en' ? 'Skill added successfully!' : 'Compétence ajoutée avec succès!');
      }
      resetForm();
      fetchSkills();
    } catch (err: any) {
      setError(err.response?.data?.message || (language === 'en' ? 'Operation failed' : 'L\'opération a échoué'));
    }
  };

  const handleDelete = async (id: number) => {
    setConfirmDialog({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/skills/${confirmDialog.id}`, authConfig);
      setSuccess(language === 'en' ? 'Skill deleted successfully!' : 'Compétence supprimée avec succès!');
      fetchSkills();
      setConfirmDialog({ isOpen: false, id: 0 });
    } catch (err: any) {
      setError(err.response?.data?.message || (language === 'en' ? 'Delete failed' : 'La suppression a échoué'));
      setConfirmDialog({ isOpen: false, id: 0 });
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
      <h2><i className="fas fa-star"></i> {t('admin.tabs.skills')} - {t('admin.manageSections')}</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <ConfirmationModal
        isOpen={confirmDialog.isOpen}
        title={language === 'en' ? 'Delete Skill' : 'Supprimer la compétence'}
        message={language === 'en' ? 'Are you sure you want to delete this skill? This action cannot be undone.' : 'Êtes-vous sûr de vouloir supprimer cette compétence? Cette action ne peut pas être annulée.'}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        isDangerous={true}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, id: 0 })}
      />

      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="skill-form">
            <h4>{editingId ? (language === 'en' ? 'Edit Skill' : 'Modifier la compétence') : (language === 'en' ? 'Add Skill' : 'Ajouter une compétence')}</h4>

            <div className="mb-3">
              <label className="form-label">{language === 'en' ? 'Skill Name' : 'Nom de la compétence'}</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">{language === 'en' ? 'Proficiency (%)' : 'Maîtrise (%)'}</label>
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
              <label className="form-label">{language === 'en' ? 'A quick description (e.g. your experience)' : 'Une brève description (par exemple votre expérience)'}</label>
              <input
                type="text"
                className="form-control"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder={language === 'en' ? 'fa-code' : 'fa-code'}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">{language === 'en' ? 'Display Order' : "Ordre d'affichage"}</label>
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
          <h4>{language === 'en' ? 'Current Skills' : 'Compétences actuelles'}</h4>
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
