const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

router.post('/', async (req, res) => {
    const { question, lesson_title } = req.body;
    
    if (!question) {
        return res.status(400).json({ message: 'Question is required' });
    }

    // Use Gemini if API key is present
    if (process.env.GEMINI_API_KEY) {
        try {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            // Using a standard, fast model
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            
            const prompt = `You are an expert, encouraging AI tutor for an educational course. The student is currently studying the lesson "${lesson_title || 'a general topic'}". 
            
            The student asks: "${question}"
            
            Please provide a helpful, educational, and concise answer (maximum 2-3 short paragraphs). Do not use markdown headers, just plain text or simple bullet points.`;
            
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            return res.json({ answer: text });
        } catch (error) {
            console.error("Gemini AI Error:", error);
            // If it fails (e.g., invalid key), fall through to the mock response
        }
    }
    
    // Fallback Mock AI endpoint since we don't have API keys or they failed
    setTimeout(() => {
        const responses = [
            `That's a great question about ${lesson_title || 'this topic'}! Based on standard practices, you should consider reviewing the core fundamentals of this lesson section.`,
            `The answer is quite nuanced. In the context of ${lesson_title || 'what we learned'}, the primary consideration should be understanding the underlying concepts before applying them.`,
            `I'd recommend re-watching the middle section of the video where the instructor explains this concept in deep detail. Let me know if you need specific timestamps!`
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        res.json({ answer: randomResponse });
    }, 1500);
});

module.exports = router;
