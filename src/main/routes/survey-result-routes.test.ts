import app from '@/main/config/app';
import { MongoHelper } from '@/infra/db/mongodb/helpers';
import env from '@/main/config/env';
import { type Collection } from 'mongodb';
import { sign } from 'jsonwebtoken';
import request from 'supertest';

let surveyCollection: Collection;
let accountCollection: Collection;

const makeAccessToken = async (): Promise<string> => {
  const res = await accountCollection.insertOne({
    name: 'Gabriel',
    email: 'gabriel.nascimento@email.com',
    password: '123'
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

  describe('PUT /surveys/:survey_id/results', () => {
    test('should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answers: [
            {
              answer: 'any_answer'
            }
          ]
        })
        .expect(403);
    });

    test('should return 200 on save survey result with accessToken', async () => {
      const accessToken = await makeAccessToken();
      const response = await surveyCollection.insertOne({
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
      });

      const surveyId = String(response.insertedId);

      await request(app)
        .put(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'Answer 1'
        })
        .expect(200);
    });
  });

  describe('GET /surveys/:survey_id/results ', () => {
    test('should return 403 on LoadSurveyResult without accessToken', async () => {
      await request(app)
        .get('/api/surveys/any_id/results')
        .expect(403);
    });

    test('should return 200 on LoadSurveyResult with accessToken', async () => {
      const accessToken = await makeAccessToken();
      const response = await surveyCollection.insertOne({
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
      });

      const surveyId = String(response.insertedId);

      await request(app)
        .get(`/api/surveys/${surveyId}/results`)
        .set('x-access-token', accessToken)
        .expect(200);
    });
  });
});
