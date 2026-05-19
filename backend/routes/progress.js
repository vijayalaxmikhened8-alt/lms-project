const express = require('express');
const router = express.Router();
const db = require('../db');

// Mark lesson as complete
router.post('/', (req, res) => {
    const { user_id, lesson_id } = req.body;
    
    db.run(
        'INSERT INTO progress (user_id, lesson_id) VALUES (?, ?)',
        [user_id, lesson_id],
        function(err) {
            if (err) {
                return res.status(400).json({ message: 'Already marked as complete or error' });
            }
            res.status(201).json({ message: 'Progress recorded' });
        }
    );
});

// Get user progress for a course
router.get('/:userId/course/:courseId', (req, res) => {
    const { userId, courseId } = req.params;
    
    // Get all lessons for course
    db.all('SELECT id FROM lessons WHERE course_id = ?', [courseId], (err, lessons) => {
        if (err || !lessons || lessons.length === 0) return res.json({ progress: 0, completed_lessons: [] });
        
        const totalLessons = lessons.length;
        const lessonIds = lessons.map(l => l.id);
        
        // Count how many are completed by user
        db.all(
            `SELECT lesson_id FROM progress WHERE user_id = ? AND lesson_id IN (${lessonIds.join(',')})`,
            [userId],
            (err, completed) => {
                const completedCount = completed ? completed.length : 0;
                const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
                
                res.json({
                    progress: progressPercent,
                    completed_lessons: completed ? completed.map(c => c.lesson_id) : []
                });
            }
        );
    });
});

module.exports = router;
