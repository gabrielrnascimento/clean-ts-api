import app from '@/main/config/app';
import { MongoHelper } from '@/infra/db/mongodb';
import request from 'supertest';
import { type Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';
import env from '@/main/config/env';

let accountCollection: Collection;
let surveyCollection: Collection;

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

describe('SurveyResult GraphQL', () => {
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

  describe('SurveyResult Query', () => {
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

    const generateQuery = (surveyId: string): string => `
      query {
        surveyResult (surveyId: "${surveyId}") {
          question
          answers {
            answer
            count
            percent
            isCurrentAccountAnswer
          }
          date
        }
      }`;

    test('should return survey result on success', async () => {
      const accessToken = await mockAccessToken();
      const insertedDocument = await surveyCollection.insertOne(surveyData);
      const query = generateQuery(insertedDocument.insertedId.toString());

      const res = await request(app)
        .post('/graphql')
        .set('x-access-token', accessToken)
        .send({ query });

      expect(res.status).toBe(200);
      expect(res.body.data.surveyResult.question).toBe(surveyData.question);
      expect(res.body.data.surveyResult.date).toBe(surveyData.date.toISOString());
      expect(res.body.data.surveyResult.answers).toEqual([
        {
          answer: surveyData.answers[0].answer,
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false
        },
        {
          answer: surveyData.answers[1].answer,
          count: 0,
          percent: 0,
          isCurrentAccountAnswer: false
        }
      ]);
    });

    test('should return an AccessDeniedError if no token is provided', async () => {
      const insertedDocument = await surveyCollection.insertOne(surveyData);
      const query = generateQuery(insertedDocument.insertedId.toString());

      const res = await request(app)
        .post('/graphql')
        .send({ query });

      expect(res.status).toBe(403);
      expect(res.body.data).toBeFalsy();
      expect(res.body.errors[0].message).toBe('Access denied');
    });
  });
});
