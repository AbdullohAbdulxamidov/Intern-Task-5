import seedrandom from 'seedrandom';

export default async function handler(req, res) {
    // Set CORS headers to allow requests from any origin
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { page = 1, region = 'en', seed = 'random', likes = 5, reviews = 4.7 } = req.query;

    try {
        const books = generateBooks(page, region, seed, likes, reviews);
        res.status(200).json(books);
    } catch (error) {
        console.error('Error generating books:', error.message);
        res.status(500).json({ error: error.message });
    }
}

function generateBooks(page, region, seed, likes, reviews) {
    // Initialize seeded random number generator
    const rng = seedrandom(`${seed}-${page}`);
    const books = [];

    // Generate 10 books per page
    for (let i = 0; i < 10; i++) {
        const title = generateRandomWords(rng, 3);
        const author = generateRandomName(rng);
        const publisher = generateRandomPublisher(rng);
        const isbn = generateRandomISBN(rng);

        // Generate fractional likes and reviews
        const actualLikes = Math.round(rng() * likes);
        const actualReviews = Math.round(rng() * reviews);

        books.push({
            isbn,
            title,
            author,
            publisher,
            likes: actualLikes,
            reviews: actualReviews,
            details: {
                coverImage: `https://picsum.photos/150/200?random=${isbn}`,
                reviewTexts: Array(actualReviews).fill(null).map(() => generateRandomSentence(rng)),
                reviewAuthors: Array(actualReviews).fill(null).map(() => generateRandomName(rng)),
            },
        });
    }

    return books;
}

// Helper Functions for Generating Fake Data
function generateRandomWords(rng, count) {
    const words = ['Book', 'Story', 'Tale', 'Adventure', 'Journey', 'Mystery', 'Chronicle', 'Saga'];
    return Array(count)
        .fill(null)
        .map(() => words[Math.floor(rng() * words.length)])
        .join(' ');
}

function generateRandomName(rng) {
    const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Hannah'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
    return `${firstNames[Math.floor(rng() * firstNames.length)]} ${lastNames[Math.floor(rng() * lastNames.length)]}`;
}

function generateRandomPublisher(rng) {
    const publishers = ['Penguin', 'HarperCollins', 'Simon & Schuster', 'Random House', 'Macmillan'];
    return publishers[Math.floor(rng() * publishers.length)];
}

function generateRandomISBN(rng) {
    return Array(13)
        .fill(null)
        .map(() => Math.floor(rng() * 10))
        .join('');
}

function generateRandomSentence(rng) {
    const sentences = [
        'A thrilling journey through time.',
        'An unforgettable tale of love and loss.',
        'Discover the secrets of the universe.',
        'A gripping story of survival and hope.',
        'Explore the mysteries of the human heart.',
    ];
    return sentences[Math.floor(rng() * sentences.length)];
}