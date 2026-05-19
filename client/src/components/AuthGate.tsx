import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { AxiosAuthErrorResponse } from '../types/auth.types';
import './AuthGate.css';

export const AuthGate: React.FC = () => {
  const { executeLogin, executeRegister } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', firstName: '', lastName: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLoginView) {
        await executeLogin({ email: formData.email, password: formData.password });
      } else {
        await executeRegister(formData);
      }
    } catch (err) {
      const errorWrapper = err as AxiosAuthErrorResponse;
      alert(errorWrapper.response?.data?.error || errorWrapper.response?.data?.message || 'Authentication execution failed.');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-brand)' }}>
          {isLoginView ? 'Sign In' : 'Create Account'}
        </h2>
        <form onSubmit={handleSubmit}>
          {!isLoginView && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="auth-form-group" style={{ flex: 1 }}>
                <label className="auth-label">First Name</label>
                <input className="auth-input" type="text" required onChange={e => setFormData({...formData, firstName: e.target.value})} />
              </div>
              <div className="auth-form-group" style={{ flex: 1 }}>
                <label className="auth-label">Last Name</label>
                <input className="auth-input" type="text" required onChange={e => setFormData({...formData, lastName: e.target.value})} />
              </div>
            </div>
          )}
          <div className="auth-form-group">
            <label className="auth-label">Email Address</label>
            <input className="auth-input" type="email" required onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Password</label>
            <input className="auth-input" type="password" required onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          <button type="submit" className="action-btn" style={{ width: '100%', marginTop: '0.5rem' }}>
            {isLoginView ? 'Login to Cloud' : 'Register Secure Account'}
          </button>
        </form>
        <p className="toggle-link" onClick={() => setIsLoginView(!isLoginView)}>
          {isLoginView ? "Don't have an account? " : "Already have an account? "}
          <span>{isLoginView ? 'Register' : 'Login'}</span>
        </p>
      </div>
    </div>
  );
};