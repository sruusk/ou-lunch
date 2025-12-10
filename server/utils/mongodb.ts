import type { Db } from 'mongodb';
import { MongoClient } from 'mongodb';

const runtimeConfig = useRuntimeConfig();
const database: string = runtimeConfig.dbName;
const client: MongoClient = new MongoClient(runtimeConfig.dbUrl);

const connectClient = async (): Promise<void> => {
  // @ts-expect-error topology is private
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
    console.log('Connected to MongoDB');

    // Create indexes
    await client.db(database).collection('restaurants').createIndex({ name: 1 }, { unique: true });

    // Add schema validation
    for (const collection in db_validators) {
      if (Object.prototype.hasOwnProperty.call(db_validators, collection)) {
        await client.db(database).command({
          collMod: collection,
          validator: db_validators[collection as keyof typeof db_validators],
          validationLevel: 'strict',
          validationAction: 'warn',
        });
      }
    }
  }
};

export const getDb = async (): Promise<Db> => {
  // @ts-expect-error topology is private
  if (!client.topology || !client.topology.isConnected()) {
    await connectClient();
  }
  return client.db(database);
};
