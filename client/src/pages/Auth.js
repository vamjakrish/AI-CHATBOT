import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login, signup } from '../utils/api';
import './Auth.css';

export default function Auth({ mode }) {
  const isLogin = mode === 'login';
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    if (!isLogin && !form.name) {
      setError('Please enter your name.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const fn = isLogin ? login : signup;
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const { data } = await fn(payload);
      loginUser(data.token, data.user);
      navigate('/chat');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__orb auth__orb--1" />
      <div className="auth__orb auth__orb--2" />

      <Link to="/" className="auth__logo">
        <span className="auth__logo-icon">✦</span>
        NexusAI
      </Link>

      <div className="auth__card fade-in">
        <div className="auth__header">
          <h1>{isLogin ? 'Welcome back' : 'Create account'}</h1>
          <p>{isLogin ? 'Sign in to continue your conversations' : 'Start your AI journey today'}</p>
        </div>

        <form className="auth__form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="auth__field">
              <label>Full name</label>
              <input
                type="text" name="name" value={form.name}
                onChange={handleChange} placeholder="Jane Doe"
                autoComplete="name" disabled={loading}
              />
            </div>
          )}
          <div className="auth__field">
            <label>Email address</label>
            <input
              type="email" name="email" value={form.email}
              onChange={handleChange} placeholder="you@example.com"
              autoComplete="email" disabled={loading}
            />
          </div>
          <div className="auth__field">
            <label>Password</label>
            <input
              type="password" name="password" value={form.password}
              onChange={handleChange} placeholder={isLogin ? '••••••••' : 'Min. 6 characters'}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="auth__error">
              <span>⚠</span> {error}
            </div>
          )}

          <button type="submit" className="auth__submit" disabled={loading}>
            {loading ? (
              <span className="auth__spinner" />
            ) : (
              isLogin ? 'Sign in' : 'Create account'
            )}
          </button>
        </form>

        <p className="auth__switch">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <Link to={isLogin ? '/signup' : '/login'}>
            {isLogin ? 'Sign up' : 'Sign in'}
          </Link>
        </p>
      </div>
    </div>
  );
}
