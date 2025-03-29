import { faker } from '@faker-js/faker';
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
    // Use the Faker constructor to set the locale
    const localizedFaker = new faker.Faker({
        locale: [region], // Ensure this matches a valid locale (e.g., 'en', 'fr', 'de')
    });

    const rng = seedrandom(`${seed}-${page}`); // Combine seed and page number
    const books = [];

    for (let i = 0; i < 10; i++) {
        const title = localizedFaker.word.words(3);
        const author = localizedFaker.person.fullName();
        const publisher = localizedFaker.company.name();
        const isbn = localizedFaker.string.alphanumeric(13);

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
                reviewTexts: Array(actualReviews).fill(null).map(() => localizedFaker.lorem.sentence()),
                reviewAuthors: Array(actualReviews).fill(null).map(() => localizedFaker.person.fullName()),
            },
        });
    }

    return books;
}