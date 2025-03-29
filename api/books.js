import seedrandom from 'seedrandom';

export default async function handler(req, res) {
    // Set CORS headers to allow requests from any origin
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { page = 1, region = 'en-US', seed = 'default', likes = 5, reviews = 4.7 } = req.query;

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
        const title = generateRandomTitle(rng, region);
        const author = generateRandomAuthor(rng, region);
        const publisher = generateRandomPublisher(rng, region);
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
                reviewTexts: Array(actualReviews).fill(null).map(() => generateRandomReviewText(rng, region)),
                reviewAuthors: Array(actualReviews).fill(null).map(() => generateRandomAuthor(rng, region)),
            },
        });
    }

    return books;
}

// Helper Functions for Generating Random Data
function generateRandomTitle(rng, region) {
    const titles = {
        'en-US': ['The Great Adventure', 'Mystery of the Forest', 'Journey to the Stars'],
        'de-DE': ['Das große Abenteuer', 'Das Geheimnis des Waldes', 'Reise zu den Sternen'],
        'fr-FR': ['Le grand voyage', 'Le mystère de la forêt', 'Voyage vers les étoiles'],
    };

    const regionTitles = titles[region] || titles['en-US'];
    return regionTitles[Math.floor(rng() * regionTitles.length)];
}

function generateRandomAuthor(rng, region) {
    const authors = {
        'en-US': ['John Doe', 'Jane Smith', 'Alice Johnson'],
        'de-DE': ['Max Mustermann', 'Anna Schmidt', 'Hans Müller'],
        'fr-FR': ['Jean Dupont', 'Marie Martin', 'Pierre Dubois'],
    };

    const regionAuthors = authors[region] || authors['en-US'];
    return regionAuthors[Math.floor(rng() * regionAuthors.length)];
}

function generateRandomPublisher(rng, region) {
    const publishers = {
        'en-US': ['Penguin Books', 'HarperCollins', 'Simon & Schuster'],
        'de-DE': ['Fischer Verlag', 'Heyne Verlag', 'Klett-Cotta'],
        'fr-FR': ['Éditions Gallimard', 'Hachette Livre', 'Flammarion'],
    };

    const regionPublishers = publishers[region] || publishers['en-US'];
    return regionPublishers[Math.floor(rng() * regionPublishers.length)];
}

function generateRandomISBN(rng) {
    return Array(13)
        .fill(null)
        .map(() => Math.floor(rng() * 10))
        .join('');
}

function generateRandomReviewText(rng, region) {
    const reviews = {
        'en-US': ['A thrilling journey through time.', 'An unforgettable tale of love and loss.'],
        'de-DE': ['Eine spannende Reise durch die Zeit.', 'Eine unvergessliche Geschichte von Liebe und Verlust.'],
        'fr-FR': ['Un voyage passionnant à travers le temps.', 'Une histoire inoubliable d\'amour et de perte.'],
    };

    const regionReviews = reviews[region] || reviews['en-US'];
    return regionReviews[Math.floor(rng() * regionReviews.length)];
}