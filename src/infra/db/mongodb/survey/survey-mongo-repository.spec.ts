import { mockAddAccountParams, mockSurveyModels } from '@/domain/test';
import { SurveyMongoRepository } from './survey-mongo-repository';
import { MongoHelper } from '@/infra/db/mongodb/helpers';
import { type Collection } from 'mongodb';
import { type AccountModel } from '@/domain/models/account';

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository();
};

let surveyCollection: Collection;
let accountCollection: Collection;
let surveyResultCollection: Collection;

const mockAccount = async (): Promise<AccountModel> => {
  const addAccountParams = mockAddAccountParams();
  const response = await accountCollection.insertOne(addAccountParams);
  return MongoHelper.formatInsertedDocument(response, addAccountParams);
};

describe('SurveyMongoRepository', () => {
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
    surveyResultCollection = await MongoHelper.getCollection('surveyResults');
    await surveyResultCollection.deleteMany({});
  });

  describe('add()', () => {
    test('should add a survey on success', async () => {
      const sut = makeSut();
      await sut.add({
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer'
          },
          {
            answer: 'other_answer'
          }
        ],
        date: new Date()
      });
      const survey = await surveyCollection.findOne({ question: 'any_question' });
      expect(survey).toBeTruthy();
    });
  });

  describe('loadAll()', () => {
    test('should load all surveys on success', async () => {
      const account = await mockAccount();
      const mockSurveys = mockSurveyModels();
      const addedSurveys = await surveyCollection.insertMany(mockSurveys);
      await surveyResultCollection.insertOne({
        surveyId: addedSurveys.insertedIds[0],
        accountId: account.id,
        answer: mockSurveys[0].answers[0].answer,
        date: new Date()
      });
      const sut = makeSut();

      const surveys = await sut.loadAll(account.id);

      expect(surveys.length).toBe(2);
      expect(surveys[0].id).toBeTruthy();
      expect(surveys[0].question).toBe('any_question');
      expect(surveys[0].didAnswer).toBe(true);
      expect(surveys[1].question).toBe('other_question');
      expect(surveys[1].didAnswer).toBe(false);
    });

    test('should load an empty list', async () => {
      const account = await mockAccount();
      const sut = makeSut();
      const surveys = await sut.loadAll(account.id);
      expect(surveys.length).toBe(0);
    });
  });

  describe('loadById()', () => {
    test('should load survey by id on success', async () => {
      const response = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [
          {
            image: 'any_image',
            answer: 'any_answer'
          }
        ],
        date: new Date()
      });
      const sut = makeSut();
      const id = String(response.insertedId);
      const survey = await sut.loadById(id);
      expect(survey).toBeTruthy();
      expect(survey.id).toBeTruthy();
    });
  });
});
