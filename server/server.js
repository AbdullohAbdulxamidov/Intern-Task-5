import express from 'express';
import cors from 'cors';
import { generateBooks } from './dataGenerator.js';

const app = express();
const PORT = process.env.PORT || 5500; // Use environment variable for port

app.use(cors());
app.use(express.static('public'));

// API endpoint to fetch books
app.get('/api/books', (req, res) => {
    console.log('Query Parameters:', req.query);

    const { page, region, seed, likes, reviews } = req.query;
    try {
        const books = generateBooks(page, region, seed, likes, reviews);
        res.json(books);
    } catch (error) {
        console.error('Error generating books:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});