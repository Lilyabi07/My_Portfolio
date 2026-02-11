import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useLanguage } from '../../contexts/LanguageContext';
import { ConfirmationModal } from '../../components/common';
import './ResumeManager.css';

interface Resume {
  id: number;
  fileUrl: string;
  notes: string;
  updatedAt: string;
}

function ResumeManager() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    id: 0
  });
  const { t } = useLanguage();
  
  const authConfig = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/resume');
      setResumes(response.data);
    } catch (err: any) {
      setError('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are allowed');
        setSelectedFile(null);
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a PDF file');
      return;
    }

    setError('');
    setSuccess('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      await api.post('/resume/upload', formData, {
        headers: {
          ...authConfig.headers,
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('CV uploaded successfully!');
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      fetchResumes();
    } catch (err: any) {
      setError(err.response?.data || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateNotes = async (id: number) => {
    try {
      await api.put(`/resume/${id}`, { notes }, authConfig);
      setSuccess('Notes updated successfully!');
      setEditingId(null);
      setNotes('');
      fetchResumes();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (id: number) => {
    setConfirmDialog({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/resume/${confirmDialog.id}`, authConfig);
      setSuccess('CV deleted successfully!');
      fetchResumes();
      setConfirmDialog({ isOpen: false, id: 0 });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Delete failed');
      setConfirmDialog({ isOpen: false, id: 0 });
    }
  };

  const handleEdit = (resume: Resume) => {
    setEditingId(resume.id);
    setNotes(resume.notes || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNotes('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(t('resume.locale'), { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-manager">
      <h2><i className="fas fa-file-pdf"></i> Manage Resume / CV</h2>

      {error && <div className="alert alert-danger alert-dismissible fade show" role="alert">
        {error}
        <button type="button" className="btn-close" onClick={() => setError('')}></button>
      </div>}
      
      {success && <div className="alert alert-success alert-dismissible fade show" role="alert">
        {success}
        <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
      </div>}

      <ConfirmationModal
        isOpen={confirmDialog.isOpen}
        title="Delete Resume"
        message="Are you sure you want to delete this CV? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, id: 0 })}
      />

      <div className="row">
        {/* Upload Section */}
        <div className="col-md-5">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0"><i className="fas fa-cloud-upload-alt"></i> Upload New CV</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleUpload}>
                <div className="mb-3">
                  <label htmlFor="file-input" className="form-label">
                    Select PDF File (Max 5MB)
                  </label>
                  <input
                    id="file-input"
                    type="file"
                    className="form-control"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    disabled={uploading}
                  />
                  {selectedFile && (
                    <div className="mt-2">
                      <small className="text-muted">
                        <i className="fas fa-file-pdf text-danger"></i> {selectedFile.name} 
                        <span className="ms-2">({(selectedFile.size / 1024).toFixed(2)} KB)</span>
                      </small>
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={!selectedFile || uploading}
                >
                  {uploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-upload me-2"></i>
                      Upload CV
                    </>
                  )}
                </button>
              </form>

              <div className="alert alert-info mt-3 mb-0">
                <small>
                  <i className="fas fa-info-circle"></i> Only PDF files are accepted. 
                  The uploaded CV will be available for download on the Resume page.
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Existing CVs Section */}
        <div className="col-md-7">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0"><i className="fas fa-list"></i> Uploaded CVs</h5>
            </div>
            <div className="card-body">
              {resumes.length === 0 ? (
                <div className="text-center text-muted py-4">
                  <i className="fas fa-folder-open fa-3x mb-3"></i>
                  <p>No CVs uploaded yet. Upload your first CV above.</p>
                </div>
              ) : (
                <div className="resumes-list">
                  {resumes.map((resume) => (
                    <div key={resume.id} className="resume-item">
                      <div className="resume-info">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="mb-1">
                              <i className="fas fa-file-pdf text-danger me-2"></i>
                              Bianca B. - CV
                            </h6>
                            <small className="text-muted">
                              <i className="fas fa-clock me-1"></i>
                              Updated: {formatDate(resume.updatedAt)}
                            </small>
                          </div>
                          <div className="resume-actions">
                            <button
                              className="btn btn-sm btn-info me-1"
                              title="View CV"
                              onClick={(e) => {
                                e.preventDefault();
                                // Open in new tab - browser will handle PDF display
                                window.open(`/api/resume/download/${resume.id}`, '_blank');
                              }}
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                              <button
                              className="btn btn-sm btn-success me-1"
                              title="Download CV"
                              onClick={(e) => {
                                e.preventDefault();
                                // Create download link
                                const link = document.createElement('a');
                                link.href = `/api/resume/download/${resume.id}`;
                                link.download = 'Bianca B. - CV.pdf';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                            >
                              <i className="fas fa-download"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-warning me-1"
                              onClick={() => handleEdit(resume)}
                              title="Edit Notes"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(resume.id)}
                              title="Delete CV"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>

                        {editingId === resume.id ? (
                          <div className="edit-notes-form mt-2">
                            <textarea
                              className="form-control form-control-sm mb-2"
                              rows={2}
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="Add notes about this CV version..."
                            />
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleUpdateNotes(resume.id)}
                              >
                                <i className="fas fa-save me-1"></i>
                                {t('common.save')}
                              </button>
                              <button
                                className="btn btn-sm btn-secondary"
                                onClick={cancelEdit}
                              >
                                {t('common.cancel')}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {resume.notes && (
                              <div className="resume-notes mt-2">
                                <small className="text-muted">
                                  <i className="fas fa-sticky-note me-1"></i>
                                  {resume.notes}
                                </small>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="alert alert-warning mt-4">
        <i className="fas fa-exclamation-triangle me-2"></i>
        <strong>Note:</strong> The most recently uploaded CV will be displayed on the public Resume page. 
        Users will see a "Download CV" option linking to your latest uploaded file.
      </div>
    </div>
  );
}

export default ResumeManager;
