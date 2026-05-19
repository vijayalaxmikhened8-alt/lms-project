const db = require('./db');

const seedData = async () => {
    console.log("Seeding database with initial courses...");

    const courses = [
        { title: 'Advanced React Patterns', description: 'Master React with advanced patterns and performance optimizations.', instructor_id: 1, thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', duration: '12h 30m', category: 'Web Development' },
        { title: 'UI/UX Masterclass for Beginners', description: 'Learn Figma, design systems, and user research from scratch.', instructor_id: 1, thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', duration: '8h 15m', category: 'Design' },
        { title: 'Python for Data Science', description: 'Learn Pandas, NumPy, and basic machine learning concepts.', instructor_id: 1, thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', duration: '20h 45m', category: 'Data Science' },
        { title: 'Fullstack Next.js Bootstart', description: 'Build production ready Next.js 14 applications.', instructor_id: 1, thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', duration: '15h 0m', category: 'Web Development' },
        { title: 'Machine Learning A-Z', description: 'Deep Learning, NLP, and advanced ML models in Python.', instructor_id: 1, thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', duration: '40h 20m', category: 'Data Science' },
        { title: 'Digital Marketing 101', description: 'SEO, Google Ads, and Facebook Marketing strategies.', instructor_id: 1, thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', duration: '9h 10m', category: 'Business' }
    ];

    db.serialize(() => {
        db.run('DELETE FROM courses');
        db.run('DELETE FROM lessons');
        db.run('DELETE FROM enrollments');
        db.run('DELETE FROM sqlite_sequence');
        
        const stmt = db.prepare(`INSERT INTO courses (title, description, instructor_id, thumbnail, duration, category) VALUES (?, ?, ?, ?, ?, ?)`);
        courses.forEach(course => {
            stmt.run(course.title, course.description, course.instructor_id, course.thumbnail, course.duration, course.category);
        });
        stmt.finalize(() => {
            console.log("Added 6 courses.");
            
            db.serialize(() => {
                db.run(`INSERT INTO lessons (course_id, title, video_url, content_notes) VALUES (1, 'Introduction to React Patterns', 'https://www.youtube.com/embed/bMknfKXIFA8', 'This is an introductory lesson to higher order components.')`);
                db.run(`INSERT INTO lessons (course_id, title, video_url, content_notes) VALUES (2, 'Figma Interface Basics', 'https://www.youtube.com/embed/c9Wg6Cb_YlU', 'Learn to navigate the Figma UI.')`);
                db.run(`INSERT INTO lessons (course_id, title, video_url, content_notes) VALUES (3, 'Pandas DataFrames', 'https://www.youtube.com/embed/LHBE6Q9XlzI', 'Introduction to manipulating tabular data.')`);
                db.run(`INSERT INTO lessons (course_id, title, video_url, content_notes) VALUES (4, 'Next.js App Router', 'https://www.youtube.com/embed/ZjAqacIC_3c', 'Explaining the new app router in Next 14.')`);
                db.run(`INSERT INTO lessons (course_id, title, video_url, content_notes) VALUES (5, 'Neural Networks 101', 'https://www.youtube.com/embed/i_LwzRVP7bg', 'What is a perceptron?')`);
                db.run(`INSERT INTO lessons (course_id, title, video_url, content_notes) VALUES (6, 'Google Analytics Setup', 'https://www.youtube.com/embed/bixR-KIJKYM', 'How to link GA4 to your website.')`);
                
                db.run(`INSERT INTO enrollments (user_id, course_id) VALUES (2, 1)`, () => {
                    console.log("Added sample lessons to all courses and created mock enrollment.");
                    db.close();
                });
            });
        });
    });
};

setTimeout(seedData, 500);
