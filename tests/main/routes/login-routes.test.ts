import { MongoHelper } from '@/infra/db/mongodb';
import { type Collection } from 'mongodb';
import { hash } from 'bcrypt';
import request from 'supertest';
import { setupApp } from '@/main/config/app';
import { type Express } from 'express';

let app: Express;
let accountCollection: Collection;

describe('Login Routes', () => {
  beforeAll(async () => {
    app = await setupApp();
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('POST /signup', () => {
    test('should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Gabriel',
          email: 'gabriel@mail.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(200);
    });
  });

  describe('POST /login', () => {
    test('should return 200 on login', async () => {
      const password = await hash('123', 12);
      await accountCollection.insertOne({
        name: 'Gabriel',
        email: 'gabriel@mail.com',
        password
      });

      await request(app)
        .post('/api/login')
        .send({
          email: 'gabriel@mail.com',
          password: '123'
        })
        .expect(200);
    });

    test('should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'gabriel@mail.com',
          password: '123'
        })
        .expect(401);
    });
  });
});
