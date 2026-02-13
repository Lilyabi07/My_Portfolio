import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useLanguage } from '../../contexts/LanguageContext';
import { ConfirmationModal } from '../../components/common';
import './HobbiesManager.css';

interface Hobby {
  id: number;
  name: string;
  nameFr?: string;
  icon?: string;
  description?: string;
  descriptionFr?: string;
  displayOrder: number;
}

function HobbiesManager() {
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Hobby, 'id'>>({
    name: '',
    nameFr: '',
    icon: '',
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
    fetchHobbies();
  }, []);

  const fetchHobbies = async () => {
    try {
      setLoading(true);
      const response = await api.get('/hobbies');
      setHobbies(response.data);
    } catch (err: any) {
      setError(language === 'en' ? 'Failed to load hobbies' : 'Échec du chargement des loisirs');
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
        await api.put(`/hobbies/${editingId}`, formData, authConfig);
        setSuccess(language === 'en' ? 'Hobby updated successfully!' : 'Loisir mis à jour avec succès!');
      } else {
        await api.post('/hobbies', formData, authConfig);
        setSuccess(language === 'en' ? 'Hobby added successfully!' : 'Loisir ajouté avec succès!');
      }
      resetForm();
      fetchHobbies();
    } catch (err: any) {
      setError(err.response?.data?.message || (language === 'en' ? 'Operation failed' : 'L\'opération a échoué'));
    }
  };

  const handleDelete = async (id: number) => {
    setConfirmDialog({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/hobbies/${confirmDialog.id}`, authConfig);
      setSuccess(language === 'en' ? 'Hobby deleted successfully!' : 'Loisir supprimé avec succès!');
      fetchHobbies();
      setConfirmDialog({ isOpen: false, id: 0 });
    } catch (err: any) {
      setError(err.response?.data?.message || (language === 'en' ? 'Delete failed' : 'La suppression a échoué'));
      setConfirmDialog({ isOpen: false, id: 0 });
    }
  };

  const handleEdit = (hobby: Hobby) => {
    setEditingId(hobby.id);
    setFormData({
      name: hobby.name,
      nameFr: hobby.nameFr || '',
      icon: hobby.icon || '',
      description: hobby.description || '',
      descriptionFr: hobby.descriptionFr || '',
      displayOrder: hobby.displayOrder
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      nameFr: '',
      icon: '',
      description: '',
      descriptionFr: '',
      displayOrder: 0
    });
  };

  // Common Font Awesome icons
  const commonIcons = [
    'fa-book',
    'fa-gamepad',
    'fa-music',
    'fa-camera',
    'fa-palette',
    'fa-basketball',
    'fa-football',
    'fa-hiking',
    'fa-bicycle',
    'fa-utensils',
    'fa-plane',
    'fa-chess',
    'fa-code',
    'fa-running',
    'fa-swimming',
    'fa-users'
  ];

  if (loading) return <div className="text-center"><div className="spinner-border"></div></div>;

  return (
    <div className="hobbies-manager">
      <h2><i className="fas fa-heart"></i> {t('admin.tabs.hobbies')} - {t('admin.manageSections')}</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <ConfirmationModal
        isOpen={confirmDialog.isOpen}
        title={language === 'en' ? 'Delete Hobby' : 'Supprimer le loisir'}
        message={language === 'en' ? 'Are you sure you want to delete this hobby? This action cannot be undone.' : 'Êtes-vous sûr de vouloir supprimer ce loisir? Cette action ne peut pas être annulée.'}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        isDangerous={true}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, id: 0 })}
      />

      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="hobbies-form">
            <h4>{editingId ? (language === 'en' ? 'Edit Hobby' : 'Modifier le loisir') : (language === 'en' ? 'Add Hobby' : 'Ajouter un loisir')}</h4>

            <div className="mb-3">
              <label className="form-label">{language === 'en' ? 'Hobby Name' : 'Nom du loisir'} (English)</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={language === 'en' ? 'e.g., Photography, Reading, Gaming' : 'ex. Photographie, Lecture, Jeux vidéo'}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">{language === 'en' ? 'Hobby Name' : 'Nom du loisir'} (Français)</label>
              <input
                type="text"
                className="form-control"
                value={formData.nameFr}
                onChange={(e) => setFormData({ ...formData, nameFr: e.target.value })}
                placeholder={language === 'en' ? 'e.g., Photographie, Lecture, Jeux vidéo' : 'ex. Photographie, Lecture, Jeux vidéo'}
              />
              <small className="text-muted">{language === 'en' ? 'Optional: French translation of the hobby name' : 'Optionnel : traduction française du nom du loisir'}</small>
            </div>

            <div className="mb-3">
              <label className="form-label">{language === 'en' ? 'Add a Fun Icon' : 'Ajouter une icône'}</label>
              <div className="icon-selector">
                <input
                  type="text"
                  className="form-control mb-2"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder={language === 'en' ? 'select an icon' : 'sélectionner une icône'}
                />
                <div className="icon-preview">
                  {formData.icon && (
                    <>
                      <span>{language === 'en' ? 'Preview:' : 'Aperçu :'} </span>
                      <i className={`fas ${formData.icon.startsWith('fa-') ? formData.icon : 'fa-' + formData.icon}`}></i>
                    </>
                  )}
                </div>
              </div>
              <small className="text-muted">{language === 'en' ? 'Suggested icons:' : 'Icônes suggérées :'}</small>
              <div className="icon-suggestions">
                {commonIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    className="icon-btn"
                    onClick={() => setFormData({ ...formData, icon })}
                    title={icon}
                  >
                    <i className={`fas ${icon}`}></i>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">{language === 'en' ? 'Description' : 'Description'} (English)</label>
              <textarea
                className="form-control"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={language === 'en' ? 'Tell us more about this hobby...' : 'Parlez-nous de ce loisir...'}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">{language === 'en' ? 'Description' : 'Description'} (Français)</label>
              <textarea
                className="form-control"
                rows={3}
                value={formData.descriptionFr}
                onChange={(e) => setFormData({ ...formData, descriptionFr: e.target.value })}
                placeholder={language === 'en' ? 'Tell us more about this hobby...' : 'Parlez-nous de ce loisir...'}
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
                {editingId ? t('common.edit') : (language === 'en' ? t('common.add') : 'Ajouter')}
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
          <h4>{editingId ? (language === 'en' ? 'Edit Hobby' : 'Modifier le loisir') : (language === 'en' ? 'Current Hobbies' : 'Loisirs actuels')}</h4>
          <div className="hobbies-list">
            {hobbies.map((hobby) => (
              <div key={hobby.id} className="hobby-item">
                <div className="hobby-info">
                  <div className="hobby-icon-display">
                    {hobby.icon ? (
                      <i className={`fas ${hobby.icon.startsWith('fa-') ? hobby.icon : 'fa-' + hobby.icon}`}></i>
                    ) : (
                      <i className="fas fa-heart"></i>
                    )}
                  </div>
                  <div className="hobby-details">
                    <strong>{language === 'fr' && hobby.nameFr ? hobby.nameFr : hobby.name}</strong>
                    {(language === 'fr' ? hobby.descriptionFr : hobby.description) && (
                      <small className="text-muted d-block">{language === 'fr' && hobby.descriptionFr ? hobby.descriptionFr : hobby.description}</small>
                    )}
                  </div>
                </div>
                <div className="hobby-actions">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => handleEdit(hobby)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(hobby.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
            {hobbies.length === 0 && (
              <div className="text-center text-muted py-3">
                <p>{language === 'en' ? 'No hobbies yet. Add one above!' : 'Aucun loisir encore. Ajoutez-en un ci-dessus!'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HobbiesManager;
