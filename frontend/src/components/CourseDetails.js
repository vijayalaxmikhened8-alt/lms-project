import React, { useState } from 'react';
import './CourseDetails.css';

const CourseDetails = ({ course, onBack, onAddToCart }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  if (!course) return null;

  return (
    <div className="course-details-container">
      <button className="back-btn" onClick={onBack}>
        ← Back to Courses
      </button>

      <div className="course-details-content">
        <div className="course-details-left">
          <div className="course-details-image-wrapper">
            {isVideoPlaying && course.videoUrl ? (
              <iframe
                className="course-video-player"
                src={`${course.videoUrl}?autoplay=1`}
                title={course.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <img src={course.image} alt={course.title} className="course-details-image" />
            )}
          </div>
        </div>

        <div className="course-details-right">
          <h1 className="course-details-title">{course.title}</h1>
          <p className="course-details-instructor">Instructed by {course.instructor}</p>
          
          <div className="course-details-rating">
            <span className="rating-num">{course.rating}</span>
            <span className="stars">★★★★★</span>
            <span className="reviews">({course.reviews} ratings)</span>
          </div>

          <div className="course-details-price">
            <span className="price-current">₹{course.price}</span>
            <span className="price-original">₹{course.originalPrice}</span>
            <span className="price-discount">{course.discount}% off</span>
          </div>

          <div className="course-details-actions">
            <button 
              className="btn btn-primary btn-large btn-full" 
              onClick={() => setIsVideoPlaying(true)}
            >
              {isVideoPlaying ? "Playing Masterclass..." : "Buy now & Watch"}
            </button>
            <button className="btn btn-outline btn-large btn-full" onClick={onAddToCart}>
              Add to cart
            </button>
          </div>
          
          <div className="course-details-info">
             <p>✓ 30-Day Money-Back Guarantee</p>
             <p>✓ Full lifetime access</p>
             <p>✓ Certificate of completion</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
