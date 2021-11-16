import { MongoClient, Db } from 'mongodb';

export default async function connectToDatabase(): Promise<Db>{
    const url = process.env.MONGO_DB_URI;
    const dbName = process.env.DB_NAME;

    if (url == null)
    {
        throw new Error("Unable to load mongodb url");
    }

    const client = new MongoClient(url);
    await client.connect();

    const db = client.db(dbName);
    return db;
}