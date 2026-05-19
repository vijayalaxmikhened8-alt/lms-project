const express = require('express');
const router = express.Router();
const db = require('../db');

// Add a lesson to a course
router.post('/', (req, res) => {
    const { course_id, title, video_url, content_notes } = req.body;
    db.run(
        'INSERT INTO lessons (course_id, title, video_url, content_notes) VALUES (?, ?, ?, ?)',
        [course_id, title, video_url || '', content_notes || ''],
        function(err) {
            if (err) {
                return res.status(500).json({ message: 'Error adding lesson' });
            }
            res.status(201).json({ message: 'Lesson added successfully', lessonId: this.lastID });
        }
    );
});

module.exports = router;
