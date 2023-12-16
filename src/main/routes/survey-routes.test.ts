import request from 'supertest';
import app from '../config/app';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import { type Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';
import env from '../config/env';

let surveyCollection: Collection;
let accountCollection: Collection;

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});

    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('GET /surveys', () => {
    test('should return 403 on load surveys without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403);
    });
  });

  describe('POST /surveys', () => {
    test('should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [
            {
              image: 'http://image-name.com',
              answer: 'Answer 1'
            },
            {
              answer: 'Answer 2'
            }
          ]
        })
        .expect(403);
    });

    test('should return 204 on add survey with valid accessToken', async () => {
      const res = await accountCollection.insertOne({
        name: 'Gabriel',
        email: 'gabriel@mail.com',
        password: '123',
        role: 'admin'
      });

      const id = res.insertedId;
      const accessToken = sign({ id }, env.jwtSecret);
      await accountCollection.updateOne({
        _id: id
      }, {
        $set: {
          accessToken
        }
      });

      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [
            {
              image: 'http://image-name.com',
              answer: 'Answer 1'
            },
            {
              answer: 'Answer 2'
            }
          ]
        })
        .expect(204);
    });
  });
});
