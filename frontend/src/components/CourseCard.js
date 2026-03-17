import React from 'react';
import './CourseCard.css';

const CourseCard = ({ course, onClick }) => {
  return (
    <div className="course-card" onClick={onClick}>
      <div className="course-image-container">
        <img src={course.image} alt={course.title} className="course-image" />
      </div>
      <div className="course-content">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-instructor">{course.instructor}</p>
        
        <div className="course-rating-container">
          <span className="course-rating-num">{course.rating}</span>
          <span className="course-stars">★★★★★</span>
          <span className="course-reviews">({course.reviews})</span>
        </div>
        
        <div className="course-price-container">
          <span className="course-price">₹{course.price}</span>
          <span className="course-original-price">₹{course.originalPrice}</span>
          <span className="course-discount">{course.discount}% off</span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
