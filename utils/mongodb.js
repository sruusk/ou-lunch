const { MongoClient, Db } = require('mongodb');
const database = process.env.DBNAME || 'ou-lunch';

const client = new MongoClient(process.env.DBURL || 'mongodb://127.0.0.1:27017');

const schema = require('./validators');

if(!client.connection) client.connect().then(async () => {
    console.log('Connected to MongoDB');
    // Create indexes
    await client.db(database).collection('restaurants').createIndex({ name: 1 }, { unique: true });

    // Add schema validation
    Object.keys(schema).forEach((collection) => {
        client.db(database).command({
            collMod: collection,
            validator: schema[collection],
            validationLevel: 'strict',
            validationAction: 'warn'
        });
    });
});

/**
 * Get the database.
 * @returns {Promise<Db>}
 */
const getDb = async () => {
    if(!client.connection) await client.connect();
    return client.db(database);
};

module.exports = { getDb };
