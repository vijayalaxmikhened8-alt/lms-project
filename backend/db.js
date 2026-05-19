const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.resolve(__dirname, 'lms.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'student'
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            instructor_id INTEGER NOT NULL,
            thumbnail TEXT,
            duration TEXT,
            category TEXT,
            FOREIGN KEY(instructor_id) REFERENCES users(id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS lessons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            course_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            video_url TEXT,
            content_notes TEXT,
            FOREIGN KEY(course_id) REFERENCES courses(id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS enrollments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            course_id INTEGER NOT NULL,
            enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(course_id) REFERENCES courses(id),
            UNIQUE(user_id, course_id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            lesson_id INTEGER NOT NULL,
            completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(lesson_id) REFERENCES lessons(id),
            UNIQUE(user_id, lesson_id)
        )`);

        bcrypt.hash('password123', 10, (err, hash) => {
            if (!err) {
                db.run(`INSERT OR IGNORE INTO users (name, email, password, role) VALUES ('Instructor Admin', 'instructor@test.com', ?, 'instructor')`, [hash]);
                db.run(`INSERT OR IGNORE INTO users (name, email, password, role) VALUES ('Student Test', 'student@test.com', ?, 'student')`, [hash]);
            }
        });
    }
});

module.exports = db;
