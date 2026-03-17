import React, { useState } from 'react';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Successfully submitted ${mode} form!`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <h2 className="modal-title">{mode === 'login' ? 'Welcome Back' : 'Create an Account'}</h2>
        <p className="modal-subtitle">
          {mode === 'login' 
            ? 'Enter your details to access your courses.' 
            : 'Join Kodemy to start learning today.'}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" placeholder="John Doe" required />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" placeholder="you@example.com" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="••••••••" required />
          </div>

          <button type="submit" className="btn btn-primary btn-full modal-submit">
            {mode === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div className="modal-toggle">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button className="text-link" onClick={() => setMode('signup')}>Sign up</button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button className="text-link" onClick={() => setMode('login')}>Log in</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
