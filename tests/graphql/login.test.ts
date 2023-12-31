import app from '@/main/config/app';
import { MongoHelper } from '@/infra/db/mongodb';
import { hash } from 'bcrypt';
import request from 'supertest';
import { type Collection } from 'mongodb';

let accountCollection: Collection;

describe('Login GraphQL', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('Login Query', () => {
    const generateQuery = (email: string, password: string): string => `
      query {
        login(email: "${email}", password: "${password}") {
          accessToken
          name
          }
        }`;

    const email = 'gabriel@mail.com';
    const password = '123';
    const name = 'Gabriel';

    const query = generateQuery(email, password);

    test('should return an account on valid credentials', async () => {
      const hashedPassword = await hash(password, 12);
      await accountCollection.insertOne({
        name,
        email,
        password: hashedPassword
      });

      const res = await request(app)
        .post('/graphql')
        .send({ query });

      expect(res.status).toBe(200);
      expect(res.body.data.login.accessToken).toBeTruthy();
      expect(res.body.data.login.name).toBe(name);
    });

    test('should return UnauthorizedError on invalid credentials', async () => {
      const res = await request(app)
        .post('/graphql')
        .send({ query });

      expect(res.status).toBe(401);
      expect(res.body.data).toBeFalsy();
      expect(res.body.errors[0].message).toBe('Unauthorized');
    });

    test('should return InvalidParamError on invalid data', async () => {
      const res = await request(app)
        .post('/graphql')
        .send({
          query: generateQuery('invalid_email', password)
        });

      expect(res.status).toBe(400);
      expect(res.body.data).toBeFalsy();
      expect(res.body.errors[0].message).toBe('Invalid param: email');
    });
  });
});
