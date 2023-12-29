import request from 'supertest';
import app from '@/main/config/app';
import { MongoHelper } from '@/infra/db/mongodb';
import { type Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';
import env from '@/main/config/env';

let surveyCollection: Collection;
let accountCollection: Collection;

const makeAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Gabriel',
    email: 'gabriel.nascimento@email.com',
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

  return accessToken;
};

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

    test('should return 204 on load surveys with valid accessToken', async () => {
      const accessToken = await makeAccessToken();

      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(204);
    });

    test('should return 200 on load surveys with valid accessToken', async () => {
      const accessToken = await makeAccessToken();

      await surveyCollection.insertMany([
        {
          question: 'Question 1',
          answers: [
            {
              image: 'http://image-name.com',
              answer: 'Answer 1'
            },
            {
              answer: 'Answer 2'
            }
          ],
          date: new Date()
        }
      ]);

      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(200);
    });
  });

  describe('POST /surveys', () => {
    test('should return 400 on add survey if invalid body is provided', async () => {
      const accessToken = await makeAccessToken();

      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers:
            {
              image: 'http://image-name.com',
              answer: 'Answer 1'
            }
        })
        .expect(400);
    });

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
      const accessToken = await makeAccessToken();

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
