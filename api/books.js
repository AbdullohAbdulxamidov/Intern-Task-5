import { faker } from '@faker-js/faker';
import seedrandom from 'seedrandom';

export default async function handler(req, res) {
    const { page, region, seed, likes, reviews } = req.query;

    try {
        const books = generateBooks(page, region, seed, likes, reviews);
        res.status(200).json(books);
    } catch (error) {
        console.error('Error generating books:', error.message);
        res.status(500).json({ error: error.message });
    }
}

function generateBooks(page, region, seed, likes, reviews) {
    faker.locale = region.split('-')[0]; // Set locale based on region
    const rng = seedrandom(`${seed}-${page}`); // Combine seed and page number
    const books = [];

    for (let i = 0; i < 10; i++) {
        const title = faker.word.words(3);
        const author = faker.person.fullName();
        const publisher = faker.company.name();
        const isbn = faker.string.alphanumeric(13);

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
                reviewTexts: Array(actualReviews).fill(null).map(() => faker.lorem.sentence()),
                reviewAuthors: Array(actualReviews).fill(null).map(() => faker.person.fullName()),
            },
        });
    }

    return books;
}