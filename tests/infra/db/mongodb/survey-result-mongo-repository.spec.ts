import { type SurveyModel } from '@/domain/models';
import { MongoHelper, SurveyResultMongoRepository } from '@/infra/db/mongodb';
import { ObjectId, type Collection } from 'mongodb';

let surveyCollection: Collection;
let surveyResultCollection: Collection;
let accountCollection: Collection;

const mockSurvey = async (): Promise<SurveyModel> => {
  const surveyData = {
    question: 'any_question',
    answers: [
      {
        image: 'any_image_1',
        answer: 'any_answer'
      },
      {
        answer: 'any_answer_2'
      },
      {
        answer: 'any_answer_3'
      }
    ],
    date: new Date()
  };
  const response = await surveyCollection.insertOne(surveyData);

  return MongoHelper.formatInsertedDocument(response, surveyData);
};

const mockAccountId = async (): Promise<string> => {
  const accountData = {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  };
  const response = await surveyCollection.insertOne(accountData);

  return MongoHelper.formatInsertedDocument(response, accountData).id;
};

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository();
};

describe('SurveyResultMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
    surveyResultCollection = await MongoHelper.getCollection('surveyResults');
    await surveyResultCollection.deleteMany({});
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  describe('save()', () => {
    test('should add a survey result if its new', async () => {
      const survey = await mockSurvey();
      const accountId = await mockAccountId();
      const sut = makeSut();

      await sut.save({
        surveyId: survey.id,
        accountId,
        answer: survey.answers[0].answer,
        date: new Date()
      });
      const surveyResult = await surveyResultCollection.findOne({
        surveyId: survey.id,
        accountId
      });

      expect(surveyResult).toBeTruthy();
    });

    test('should update survey result if its not new', async () => {
      const survey = await mockSurvey();
      const accountId = await mockAccountId();
      await surveyResultCollection.insertOne({
        surveyId: new ObjectId(survey.id),
        accountId: new ObjectId(accountId),
        answer: survey.answers[0].answer,
        date: new Date()
      });
      const sut = makeSut();

      await sut.save({
        surveyId: survey.id,
        accountId,
        answer: survey.answers[1].answer,
        date: new Date()
      });
      const surveyResults = await surveyResultCollection
        .find({
          surveyId: survey.id,
          accountId
        })
        .toArray();

      expect(surveyResults).toBeTruthy();
      expect(surveyResults.length).toBe(1);
    });
  });

  describe('loadBySurveyId()', () => {
    test('should return null if there is no survey result', async () => {
      const survey = await mockSurvey();
      const accountId = await mockAccountId();
      const sut = makeSut();

      const surveyResult = await sut.loadBySurveyId(survey.id, accountId);

      expect(surveyResult).toBeNull();
    });

    test('should load survey result', async () => {
      const survey = await mockSurvey();
      const accountId = await mockAccountId();
      const otherAccountId = await mockAccountId();
      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId),
          answer: survey.answers[0].answer,
          date: new Date()
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(otherAccountId),
          answer: survey.answers[0].answer,
          date: new Date()
        }
      ]);

      const sut = makeSut();
      const surveyResult = await sut.loadBySurveyId(survey.id, accountId);

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.surveyId).toEqual(survey.id);
      expect(surveyResult.answers[0].count).toBe(2);
      expect(surveyResult.answers[0].percent).toBe(100);
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true);
      expect(surveyResult.answers[1].count).toBe(0);
      expect(surveyResult.answers[1].percent).toBe(0);
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false);
    });

    test('should load survey result 2', async () => {
      const survey = await mockSurvey();
      const accountId = await mockAccountId();
      const otherAccountId = await mockAccountId();
      const anotherAccountId = await mockAccountId();
      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId),
          answer: survey.answers[0].answer,
          date: new Date()
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(otherAccountId),
          answer: survey.answers[1].answer,
          date: new Date()
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(anotherAccountId),
          answer: survey.answers[1].answer,
          date: new Date()
        }
      ]);

      const sut = makeSut();
      const surveyResult = await sut.loadBySurveyId(survey.id, otherAccountId);

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.surveyId).toEqual(survey.id);
      expect(surveyResult.answers[0].count).toBe(2);
      expect(surveyResult.answers[0].percent).toBe(67);
      expect(surveyResult.answers[0].isCurrentAccountAnswer).toBe(true);
      expect(surveyResult.answers[1].count).toBe(1);
      expect(surveyResult.answers[1].percent).toBe(33);
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false);
    });

    test('should load survey result 3', async () => {
      const survey = await mockSurvey();
      const accountId = await mockAccountId();
      const otherAccountId = await mockAccountId();
      const anotherAccountId = await mockAccountId();
      await surveyResultCollection.insertMany([
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(accountId),
          answer: survey.answers[0].answer,
          date: new Date()
        },
        {
          surveyId: new ObjectId(survey.id),
          accountId: new ObjectId(otherAccountId),
          answer: survey.answers[1].answer,
          date: new Date()
        }
      ]);

      const sut = makeSut();
      const surveyResult = await sut.loadBySurveyId(survey.id, anotherAccountId);

      expect(surveyResult).toBeTruthy();
      expect(surveyResult.surveyId).toEqual(survey.id);
      expect(surveyResult.answers[0].count).toBe(1);
      expect(surveyResult.answers[0].percent).toBe(50);
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false);
      expect(surveyResult.answers[1].count).toBe(1);
      expect(surveyResult.answers[1].percent).toBe(50);
      expect(surveyResult.answers[1].isCurrentAccountAnswer).toBe(false);
    });
  });
});
