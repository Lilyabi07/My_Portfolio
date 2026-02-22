import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../api';
import { useLanguage } from '../contexts/LanguageContext';
import './Login.css';

interface LoginProps {
  onLoginSuccess: (username: string) => void;
}

function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        username,
        password
      }, {
        timeout: 10000 // 10 second timeout
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', username);
        setAuthToken(response.data.token);
        onLoginSuccess(username);
      } else {
        setError(response.data.message || t('admin.loginFailed'));
      }
    } catch (err: any) {
      if (err.code === 'ECONNABORTED') {
        setError(t('admin.requestTimeout'));
      } else {
        setError(err.response?.data?.message || t('admin.invalidCredentials'));
      }
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <button 
        className="btn-back" 
        onClick={() => navigate('/')}
        title={t('common.backToHome')}
      >
        <i className="fas fa-arrow-left"></i> {t('common.back')}
      </button>

      <div className="login-card">
        <div className="login-header">
          <i className="fas fa-user-shield"></i>
          <h2>{t('login.title')}</h2>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">{t('admin.username')}</label>
            <div className="input-group">
              <span className="input-group-text"><i className="fas fa-user"></i></span>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">{t('admin.password')}</label>
            <div className="input-group">
              <span className="input-group-text"><i className="fas fa-lock"></i></span>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? t('admin.loggingIn') : t('nav.login')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
