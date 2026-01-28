import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

/**
 * Connect to the in-memory database.
 * function to set up the database before all tests
 */
export const connectTestDB = async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);
};

/**
 * Drop database, close the connection and stop mongod.
 */
export const closeTestDB = async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    }
    if (mongoServer) {
        await mongoServer.stop();
    }
};

/**
 * Remove all the data for all db collections.
 *  function to clean up the database between each test
 * i.e. ensure no records in any collection before each test
 */
export const clearTestDB = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection?.deleteMany({});
    }
};
