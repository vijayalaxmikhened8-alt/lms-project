const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all courses
router.get('/', (req, res) => {
    const search = req.query.search || '';
    const category = req.query.category || '';
    
    let query = 'SELECT c.*, u.name as instructor_name FROM courses c JOIN users u ON c.instructor_id = u.id WHERE 1=1';
    let params = [];
    
    if (search) {
        query += ' AND c.title LIKE ?';
        params.push(`%${search}%`);
    }
    if (category) {
        query += ' AND c.category = ?';
        params.push(category);
    }
    
    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching courses' });
        }
        res.json(rows);
    });
});

// Get enrolled courses for a user MUST BE ABOVE /:id TO AVOID CONFLICTS
router.get('/enrolled/:userId', (req, res) => {
    const userId = req.params.userId;
    db.all(
        `SELECT c.*, u.name as instructor_name 
         FROM courses c 
         JOIN enrollments e ON c.id = e.course_id 
         JOIN users u ON c.instructor_id = u.id
         WHERE e.user_id = ?`, 
        [userId], 
        (err, courses) => {
            if (err) return res.status(500).json({ message: 'Error fetching enrolled courses' });
            res.json(courses || []);
        }
    );
});

// Get course details + lessons
router.get('/:id', (req, res) => {
    const courseId = req.params.id;
    db.get('SELECT c.*, u.name as instructor_name FROM courses c JOIN users u ON c.instructor_id = u.id WHERE c.id = ?', [courseId], (err, course) => {
        if (err || !course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        
        db.all('SELECT * FROM lessons WHERE course_id = ?', [courseId], (err, lessons) => {
            course.lessons = lessons || [];
            res.json(course);
        });
    });
});

// Create a new course
router.post('/', (req, res) => {
    const { title, description, instructor_id, thumbnail, duration, category } = req.body;
    db.run(
        'INSERT INTO courses (title, description, instructor_id, thumbnail, duration, category) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, instructor_id, thumbnail || '', duration || '', category || 'General'],
        function(err) {
            if (err) {
                return res.status(500).json({ message: 'Error creating course' });
            }
            res.status(201).json({ message: 'Course created', courseId: this.lastID });
        }
    );
});

// Enroll in a course
router.post('/:id/enroll', (req, res) => {
    const courseId = req.params.id;
    const { user_id } = req.body; 
    
    db.run('INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)', [user_id, courseId], function(err) {
        if (err) {
            return res.status(400).json({ message: 'Already enrolled or error' });
        }
        res.status(201).json({ message: 'Enrolled successfully' });
    });
});

module.exports = router;
