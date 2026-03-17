import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CourseGrid from './components/CourseGrid';
import CourseDetails from './components/CourseDetails';
import AuthModal from './components/AuthModal';

function App() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [cart, setCart] = useState([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const handleHomeClick = () => {
    setSelectedCourse(null);
  };

  const handleAddToCart = (course) => {
    // Avoid duplicates for simplicity, just add to cart array
    if (!cart.some(item => item.id === course.id)) {
      setCart([...cart, course]);
      alert(`Added "${course.title}" to cart!`);
    } else {
      alert(`"${course.title}" is already in your cart!`);
    }
  };

  const handleOpenAuth = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="app-container">
      <Navbar 
        onHomeClick={handleHomeClick} 
        cartCount={cart.length}
        onLoginClick={() => handleOpenAuth('login')}
        onSignupClick={() => handleOpenAuth('signup')}
      />
      
      <main className="main-content">
        {selectedCourse ? (
          <CourseDetails 
            course={selectedCourse} 
            onBack={() => setSelectedCourse(null)} 
            onAddToCart={() => handleAddToCart(selectedCourse)}
          />
        ) : (
          <>
            <Hero onSignupClick={() => handleOpenAuth('signup')} />
            <CourseGrid onCourseClick={selectedCourse => setSelectedCourse(selectedCourse)} />
          </>
        )}
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authMode} 
      />
    </div>
  );
}

export default App;