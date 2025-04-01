import { Db, MongoClient } from 'mongodb';
import { useRuntimeConfig } from '#imports';
import { db_validators } from '~/server/utils/validators';

const runtimeConfig = useRuntimeConfig();
const database: string = runtimeConfig.dbName;
const client: MongoClient = new MongoClient(runtimeConfig.dbUrl);

const connectClient = async (): Promise<void> => {
  // @ts-ignore
  if (!client.topology || !client.topology.isConnected()) {
    await client.connect();
    console.log('Connected to MongoDB');

    // Create indexes
    await client.db(database).collection('restaurants').createIndex({ name: 1 }, { unique: true });

    // Add schema validation
    for (const collection in db_validators) {
      if (db_validators.hasOwnProperty(collection)) {
        await client.db(database).command({
          collMod: collection,
          validator: db_validators[collection as keyof typeof db_validators],
          validationLevel: 'strict',
          validationAction: 'warn'
        });
      }
    }
  }
};

export const getDb = async (): Promise<Db> => {
  // @ts-ignore
  if (!client.topology || !client.topology.isConnected()) {
    await connectClient();
  }
  return client.db(database);
};
