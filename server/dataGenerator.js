import { faker } from '@faker-js/faker';
import seedrandom from 'seedrandom';

function generateBooks(page, region, seed, likes, reviews) {
    faker.locale = region.split('-')[0]; // Set locale based on region
    const rng = seedrandom(`${seed}-${page}`); // Combine seed and page number
    const books = [];

    for (let i = 0; i < 10; i++) {
        const title = faker.word.words(3); // Generate a 3-word title
        const author = faker.person.fullName(); // Generate a full name
        const publisher = faker.company.name(); // Generate a company name
        const isbn = faker.string.alphanumeric(13); // Generate a 13-character ISBN

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

export { generateBooks };