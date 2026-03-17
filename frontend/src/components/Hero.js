import React from 'react';
import './Hero.css';

const Hero = ({ onSignupClick }) => {
  return (
    <section className="hero">
      <div className="hero-container">
        
        <div className="hero-content">
          <h1 className="hero-title">
            Skills for your present<br />
            <span className="text-gray">and your future.</span>
          </h1>
          <p className="hero-subtitle">
            World-class courses taught by expert instructors. Start learning today
            and unlock your potential.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" style={{ backgroundColor: 'white', color: 'black' }} onClick={() => alert("Scroll to courses...")}>
              Browse courses ↓
            </button>
            <button className="btn btn-outline-dark" onClick={onSignupClick}>
              Sign up free
            </button>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat-card">
            <div className="stat-number">5+</div>
            <div className="stat-label">EXPERT COURSES</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">500K+</div>
            <div className="stat-label">STUDENTS ENROLLED</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">4.7★</div>
            <div className="stat-label">AVERAGE RATING</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">100%</div>
            <div className="stat-label">FREE TO TRY</div>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default Hero;
