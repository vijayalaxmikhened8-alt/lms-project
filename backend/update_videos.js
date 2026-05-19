const db = require('./db');

const updates = [
    { id: 1, url: 'https://www.youtube.com/embed/bMknfKXIFA8' },
    { id: 2, url: 'https://www.youtube.com/embed/c9Wg6Cb_YlU' },
    { id: 3, url: 'https://www.youtube.com/embed/LHBE6Q9XlzI' },
    { id: 4, url: 'https://www.youtube.com/embed/ZjAqacIC_3c' },
    { id: 5, url: 'https://www.youtube.com/embed/i_LwzRVP7bg' },
    { id: 6, url: 'https://www.youtube.com/embed/bixR-KIJKYM' },
];

db.serialize(() => {
    updates.forEach(update => {
        db.run('UPDATE lessons SET video_url = ? WHERE course_id = ?', [update.url, update.id]);
    });
    console.log("Updated video URLs for all courses.");
});
