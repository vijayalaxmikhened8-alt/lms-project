import React from 'react';
import CourseCard from './CourseCard';
import './CourseGrid.css';

const DUMMY_COURSES = [
  {
    id: 1,
    title: "TypeScript Masterclass",
    instructor: "Dr. Instructor",
    rating: 4.2,
    reviews: "85,248",
    price: "1,299",
    originalPrice: "4,245",
    discount: 69,
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg",
    videoUrl: "https://www.youtube.com/embed/BwuLxPH8IDs"
  },
  {
    id: 2,
    title: "DevOps with Docker & Kubernetes",
    instructor: "Dr. Instructor",
    rating: 4.0,
    reviews: "151,145",
    price: "4,999",
    originalPrice: "33,197",
    discount: 85,
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg",
    videoUrl: "https://www.youtube.com/embed/3c-iZaWSM50"
  },
  {
    id: 3,
    title: "SQL & Database Design",
    instructor: "Dr. Instructor",
    rating: 4.8,
    reviews: "75,022",
    price: "999",
    originalPrice: "3,127",
    discount: 68,
    image: "https://upload.wikimedia.org/wikipedia/commons/8/87/Sql_data_base_with_logo.png",
    videoUrl: "https://www.youtube.com/embed/HXV3zeQKqGY"
  },
  {
    id: 4,
    title: "Python for Data Science",
    instructor: "Dr. Instructor",
    rating: 4.4,
    reviews: "147,840",
    price: "1,499",
    originalPrice: "6,392",
    discount: 77,
    image: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg",
    videoUrl: "https://www.youtube.com/embed/_uQrJ0TkZlc"
  },
  {
    id: 5,
    title: "React.js Complete Guide",
    instructor: "Dr. Instructor",
    rating: 4.4,
    reviews: "125,048",
    price: "3,499",
    originalPrice: "24,126",
    discount: 85,
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    videoUrl: "https://www.youtube.com/embed/w7ejDZ8SWv8"
  },
  {
    id: 6,
    title: "Machine Learning for Beginners",
    instructor: "Dr. Instructor",
    rating: 4.8,
    reviews: "29,462",
    price: "9,999",
    originalPrice: "43,629",
    discount: 77,
    image: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg",
    videoUrl: "https://www.youtube.com/embed/KNAWp2cw6jM"
  },
  {
    id: 7,
    title: "Data Structures and Algorithms",
    instructor: "Dr. Instructor",
    rating: 4.4,
    reviews: "27,168",
    price: "4,999",
    originalPrice: "26,857",
    discount: 81,
    image: "https://upload.wikimedia.org/wikipedia/commons/1/18/C_Programming_Language.svg",
    videoUrl: "https://www.youtube.com/embed/8hly31xKli0"
  },
  {
    id: 8,
    title: "Web Development for Beginners",
    instructor: "Dr. Instructor",
    rating: 4.4,
    reviews: "114,044",
    price: "3,499",
    originalPrice: "17,197",
    discount: 80,
    image: "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg",
    videoUrl: "https://www.youtube.com/embed/pQN-pnXPaVg"
  }
];

const CourseGrid = ({ onCourseClick }) => {
  return (
    <section className="course-section">
      <div className="container">
        <div className="course-header">
          <h2 className="course-section-title">All courses</h2>
          <p className="course-section-subtitle">10 courses — new content added every month</p>
        </div>
        
        <div className="course-grid">
          {DUMMY_COURSES.map(course => (
            <CourseCard key={course.id} course={course} onClick={() => onCourseClick(course)} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseGrid;
