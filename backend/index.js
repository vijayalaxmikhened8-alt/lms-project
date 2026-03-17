const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const lessons = [

    { title: "Intro", youtube_url: "https://youtu.be/video1" },
    { title: "Lesson 2", youtube_url: "https://youtu.be/video2" },
    { title: "Lesson 3", youtube_url: "https://youtu.be/video3" },
    { title: "Lesson 4", youtube_url: "https://youtu.be/video4" },
    { title: "Lesson 5", youtube_url: "https://youtu.be/video5" },
    { title: "Lesson 6", youtube_url: "https://youtu.be/video6" }
];


app.get("/lessons", (req, res) => {
    res.json(lessons);
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});