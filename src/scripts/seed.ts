import mongoose from 'mongoose';
import { config } from '../config';
import { UserModel } from '../models/User';
import { MovieModel } from '../models/Movie';
import { TVShowModel } from '../models/TVShow';
import { MyListModel } from '../models/MyList';
import logger from '../utils/logger';

const users = [
    {
        username: 'john_doe',
        preferences: {
            favoriteGenres: ['Action', 'SciFi'],
            dislikedGenres: ['Horror'],
        },
        watchHistory: [],
    },
    {
        username: 'jane_smith',
        preferences: {
            favoriteGenres: ['Comedy', 'Romance'],
            dislikedGenres: ['Horror', 'SciFi'],
        },
        watchHistory: [],
    },
    {
        username: 'test_user',
        preferences: {
            favoriteGenres: ['Drama', 'Fantasy'],
            dislikedGenres: [],
        },
        watchHistory: [],
    },
];

const movies = [
    {
        title: 'The Matrix',
        description: 'A computer hacker learns about the true nature of reality and his role in the war against its controllers.',
        genres: ['Action', 'SciFi'],
        releaseDate: new Date('1999-03-31'),
        director: 'Lana Wachowski, Lilly Wachowski',
        actors: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
    },
    {
        title: 'Inception',
        description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.',
        genres: ['Action', 'SciFi'],
        releaseDate: new Date('2010-07-16'),
        director: 'Christopher Nolan',
        actors: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page'],
    },
    {
        title: 'The Shawshank Redemption',
        description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        genres: ['Drama'],
        releaseDate: new Date('1994-09-23'),
        director: 'Frank Darabont',
        actors: ['Tim Robbins', 'Morgan Freeman'],
    },
    {
        title: 'The Dark Knight',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
        genres: ['Action', 'Drama'],
        releaseDate: new Date('2008-07-18'),
        director: 'Christopher Nolan',
        actors: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    },
    {
        title: 'Interstellar',
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
        genres: ['SciFi', 'Drama'],
        releaseDate: new Date('2014-11-07'),
        director: 'Christopher Nolan',
        actors: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    },
    {
        title: 'The Grand Budapest Hotel',
        description: 'A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy.',
        genres: ['Comedy', 'Drama'],
        releaseDate: new Date('2014-03-28'),
        director: 'Wes Anderson',
        actors: ['Ralph Fiennes', 'F. Murray Abraham', 'Mathieu Amalric'],
    },
    {
        title: 'Parasite',
        description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
        genres: ['Drama', 'Comedy'],
        releaseDate: new Date('2019-05-30'),
        director: 'Bong Joon Ho',
        actors: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'],
    },
    {
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        description: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring.',
        genres: ['Fantasy', 'Action'],
        releaseDate: new Date('2001-12-19'),
        director: 'Peter Jackson',
        actors: ['Elijah Wood', 'Ian McKellen', 'Orlando Bloom'],
    },
];

const tvShows = [
    {
        title: 'Breaking Bad',
        description: 'A high school chemistry teacher turned methamphetamine producer partners with a former student.',
        genres: ['Drama'],
        episodes: [
            {
                episodeNumber: 1,
                seasonNumber: 1,
                releaseDate: new Date('2008-01-20'),
                director: 'Vince Gilligan',
                actors: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'],
            },
            {
                episodeNumber: 2,
                seasonNumber: 1,
                releaseDate: new Date('2008-01-27'),
                director: 'Vince Gilligan',
                actors: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'],
            },
        ],
    },
    {
        title: 'Stranger Things',
        description: 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.',
        genres: ['SciFi', 'Horror', 'Drama'],
        episodes: [
            {
                episodeNumber: 1,
                seasonNumber: 1,
                releaseDate: new Date('2016-07-15'),
                director: 'The Duffer Brothers',
                actors: ['Millie Bobby Brown', 'Finn Wolfhard', 'Winona Ryder'],
            },
            {
                episodeNumber: 2,
                seasonNumber: 1,
                releaseDate: new Date('2016-07-15'),
                director: 'The Duffer Brothers',
                actors: ['Millie Bobby Brown', 'Finn Wolfhard', 'Winona Ryder'],
            },
        ],
    },
    {
        title: 'The Office',
        description: 'A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.',
        genres: ['Comedy'],
        episodes: [
            {
                episodeNumber: 1,
                seasonNumber: 1,
                releaseDate: new Date('2005-03-24'),
                director: 'Greg Daniels',
                actors: ['Steve Carell', 'Rainn Wilson', 'John Krasinski'],
            },
            {
                episodeNumber: 2,
                seasonNumber: 1,
                releaseDate: new Date('2005-03-29'),
                director: 'Greg Daniels',
                actors: ['Steve Carell', 'Rainn Wilson', 'John Krasinski'],
            },
        ],
    },
    {
        title: 'Game of Thrones',
        description: 'Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns.',
        genres: ['Fantasy', 'Drama', 'Action'],
        episodes: [
            {
                episodeNumber: 1,
                seasonNumber: 1,
                releaseDate: new Date('2011-04-17'),
                director: 'David Benioff, D.B. Weiss',
                actors: ['Emilia Clarke', 'Peter Dinklage', 'Kit Harington'],
            },
            {
                episodeNumber: 2,
                seasonNumber: 1,
                releaseDate: new Date('2011-04-24'),
                director: 'David Benioff, D.B. Weiss',
                actors: ['Emilia Clarke', 'Peter Dinklage', 'Kit Harington'],
            },
        ],
    },
    {
        title: 'The Crown',
        description: 'Follows the political rivalries and romance of Queen Elizabeth II\'s reign and the events that shaped the second half of the 20th century.',
        genres: ['Drama'],
        episodes: [
            {
                episodeNumber: 1,
                seasonNumber: 1,
                releaseDate: new Date('2016-11-04'),
                director: 'Peter Morgan',
                actors: ['Claire Foy', 'Matt Smith', 'Vanessa Kirby'],
            },
            {
                episodeNumber: 2,
                seasonNumber: 1,
                releaseDate: new Date('2016-11-04'),
                director: 'Peter Morgan',
                actors: ['Claire Foy', 'Matt Smith', 'Vanessa Kirby'],
            },
        ],
    },
];

async function seed() {
    try {
        // Connect to database
        await mongoose.connect(config.mongodb.uri);
        logger.info('Connected to MongoDB for seeding');

        // Clear existing data
        logger.info('Clearing existing data...');
        await Promise.all([
            UserModel.deleteMany({}),
            MovieModel.deleteMany({}),
            TVShowModel.deleteMany({}),
            MyListModel.deleteMany({}),
        ]);
        logger.info('Existing data cleared');

        // Insert users
        logger.info('Inserting users...');
        const createdUsers = await UserModel.insertMany(users);
        logger.info(`Inserted ${createdUsers.length} users`);

        // Insert movies
        logger.info('Inserting movies...');
        const createdMovies = await MovieModel.insertMany(movies);
        logger.info(`Inserted ${createdMovies.length} movies`);

        // Insert TV shows
        logger.info('Inserting TV shows...');
        const createdTVShows = await TVShowModel.insertMany(tvShows);
        logger.info(`Inserted ${createdTVShows.length} TV shows`);

        // Create some sample My List entries
        logger.info('Creating sample My List entries...');
        const sampleListItems = [
            {
                userId: createdUsers[0]._id.toString(),
                contentId: createdMovies[0]._id.toString(),
                contentType: 'movie',
                addedAt: new Date(),
            },
            {
                userId: createdUsers[0]._id.toString(),
                contentId: createdMovies[1]._id.toString(),
                contentType: 'movie',
                addedAt: new Date(),
            },
            {
                userId: createdUsers[0]._id.toString(),
                contentId: createdTVShows[0]._id.toString(),
                contentType: 'tvshow',
                addedAt: new Date(),
            },
            {
                userId: createdUsers[1]._id.toString(),
                contentId: createdMovies[5]._id.toString(),
                contentType: 'movie',
                addedAt: new Date(),
            },
            {
                userId: createdUsers[1]._id.toString(),
                contentId: createdTVShows[2]._id.toString(),
                contentType: 'tvshow',
                addedAt: new Date(),
            },
        ];

        await MyListModel.insertMany(sampleListItems);
        logger.info(`Created ${sampleListItems.length} sample My List entries`);

        // Display created IDs for testing
        console.log('\n=== SEED DATA SUMMARY ===\n');
        console.log('Users:');
        createdUsers.forEach((user) => {
            console.log(`  - ${user.username}: ${user._id}`);
        });

        console.log('\nMovies:');
        createdMovies.forEach((movie) => {
            console.log(`  - ${movie.title}: ${movie._id}`);
        });

        console.log('\nTV Shows:');
        createdTVShows.forEach((show) => {
            console.log(`  - ${show.title}: ${show._id}`);
        });

        console.log('\n=== TESTING INSTRUCTIONS ===\n');
        console.log('Use the following header for API requests:');
        console.log(`x-user-id: ${createdUsers[0]._id}`);
        console.log('\nExample API calls:');
        console.log(`\nAdd to My List:`);
        console.log(`POST http://localhost:3000/api/v1/mylist`);
        console.log(`Headers: { "x-user-id": "${createdUsers[0]._id}" }`);
        console.log(`Body: { "contentId": "${createdMovies[2]._id}", "contentType": "movie" }`);
        console.log(`\nList My Items:`);
        console.log(`GET http://localhost:3000/api/v1/mylist?page=1&limit=10`);
        console.log(`Headers: { "x-user-id": "${createdUsers[0]._id}" }`);
        console.log(`\nRemove from My List:`);
        console.log(`DELETE http://localhost:3000/api/v1/mylist/${createdMovies[0]._id}`);
        console.log(`Headers: { "x-user-id": "${createdUsers[0]._id}" }`);

        logger.info('\nSeeding completed successfully!');
        process.exit(0);
    } catch (error) {
        logger.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
