const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');

const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');
const lessonsRoutes = require('./routes/lessons');
const progressRoutes = require('./routes/progress');
const aiRoutes = require('./routes/ai');

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/ask-ai', aiRoutes);

// Fallback/test route
app.get('/', (req, res) => {
    res.json({ message: 'LMS API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});