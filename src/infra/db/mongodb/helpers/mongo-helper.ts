import { type Collection, MongoClient, ObjectId, type InsertOneResult } from 'mongodb';

export const MongoHelper = {
  client: null as unknown as MongoClient,
  uri: null as unknown as string,

  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri);
    this.uri = uri;
  },

  async disconnect (): Promise<void> {
    await this.client.close();
    this.client = null;
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client) this.client = await MongoClient.connect(this.uri);
    return this.client.db().collection(name);
  },

  map (collection: any): any {
    const { _id, ...collectionWithoutId } = collection;
    return Object.assign({}, collectionWithoutId, { id: _id });
  },

  mapArray (collection: any[]): any[] {
    return collection.map(c => MongoHelper.map(c));
  },

  formatInsertedDocument (result: InsertOneResult<Document>, data: any): any {
    return Object.assign({}, data, { id: result.insertedId });
  },

  convertToObjectId (id: string): ObjectId {
    return new ObjectId(id);
  }
};
