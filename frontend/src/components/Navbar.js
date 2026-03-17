import React from 'react';
import './Navbar.css';

const Navbar = ({ onHomeClick, cartCount, onLoginClick, onSignupClick }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={onHomeClick} style={{ cursor: 'pointer' }}>
          <span className="logo-text">Kodemy</span>
          <span className="ai-badge">✨ AI Assistant</span>
        </div>
        
        <div className="navbar-links">
          <button className="icon-btn" aria-label="Cart" style={{ position: 'relative' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#e53e3e',
                color: 'white', borderRadius: '50%', width: '18px', height: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: 'bold'
              }}>
                {cartCount}
              </span>
            )}
          </button>
          
          <button className="nav-btn active" onClick={onHomeClick}>Home</button>
          <button className="nav-btn btn-outline" onClick={onLoginClick}>Log in</button>
          <button className="nav-btn btn-primary" onClick={onSignupClick}>Sign up</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
