import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', {
        username,
        password
      }, {
        timeout: 10000 // 10 second timeout
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', username);
        onLoginSuccess(username);
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err: any) {
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout - backend server may not be running');
      } else {
        setError(err.response?.data?.message || 'Invalid username or password. Check if backend is running.');
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
        title="Back to homepage"
      >
        <i className="fas fa-arrow-left"></i> Back
      </button>

      <div className="login-card">
        <div className="login-header">
          <i className="fas fa-user-shield"></i>
          <h2>Login</h2>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
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
            <label htmlFor="password" className="form-label">Password</label>
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <p className="text-muted">Default credentials: updating...</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
