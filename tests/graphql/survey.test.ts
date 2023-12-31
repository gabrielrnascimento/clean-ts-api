import { setupApp } from '@/main/config/app';
import { MongoHelper } from '@/infra/db/mongodb';
import request from 'supertest';
import { type Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';
import env from '@/main/config/env';
import { type Express } from 'express';

let accountCollection: Collection;
let surveyCollection: Collection;
let app: Express;

const mockAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Gabriel',
    email: 'gabriel@mail.com',
    password: '123',
    role: 'admin'
  });

  const id = res.insertedId.toHexString();
  const accessToken = sign({ id }, env.jwtSecret);
  await accountCollection.updateOne({
    _id: res.insertedId
  }, {
    $set: {
      accessToken
    }
  });
  return accessToken;
};

describe('Survey GraphQL', () => {
  beforeAll(async () => {
    app = await setupApp();
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

  describe('Surveys Query', () => {
    const generateQuery = (): string => `
      query {
        surveys {
          id
          question
          answers {
            image
            answer
          }
          date
          didAnswer
        }
      }`;

    const query = generateQuery();

    test('should return surveys on success', async () => {
      const accessToken = await mockAccessToken();
      const surveyData = {
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
      };
      await surveyCollection.insertOne(surveyData);
      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query });

      expect(res.status).toBe(200);
      expect(res.body.data.surveys.length).toBe(1);
      expect(res.body.data.surveys[0].id).toBeTruthy();
      expect(res.body.data.surveys[0].question).toBe(surveyData.question);
      expect(res.body.data.surveys[0].date).toBe(surveyData.date.toISOString());
      expect(res.body.data.surveys[0].didAnswer).toBe(false);
      expect(res.body.data.surveys[0].answers).toEqual([
        {
          image: surveyData.answers[0].image,
          answer: surveyData.answers[0].answer
        },
        {
          image: null,
          answer: surveyData.answers[1].answer
        }
      ]);
    });

    test('should return an AccessDeniedError if no token is provided', async () => {
      const surveyData = {
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
      };
      await surveyCollection.insertOne(surveyData);
      const res = await request(app)
        .post('/graphql')
        .send({ query });

      expect(res.status).toBe(403);
      expect(res.body.data).toBeFalsy();
      expect(res.body.errors[0].message).toBe('Access denied');
    });
  });
});
