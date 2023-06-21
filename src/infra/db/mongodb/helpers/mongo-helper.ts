import { type Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  client: null as unknown as MongoClient,

  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(process.env.MONGO_URL as string);
  },

  async disconnect (): Promise<void> {
    await this.client.close();
  },

  getCollection (name: string): Collection {
    return this.client.db().collection(name);
  }
};
