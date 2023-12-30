import { mockAddAccountParams, mockAddSurveyParams, mockSurveyModels } from '../../../domain/mocks';
import { MongoHelper, SurveyMongoRepository } from '@/infra/db/mongodb';
import { ObjectId, type Collection } from 'mongodb';

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository();
};

let surveyCollection: Collection;
let accountCollection: Collection;
let surveyResultCollection: Collection;

const mockAccountId = async (): Promise<string> => {
  const addAccountParams = mockAddAccountParams();
  const response = await accountCollection.insertOne(addAccountParams);
  return String(response.insertedId);
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
      const accountId = await mockAccountId();
      const mockSurveys = mockSurveyModels();
      const addedSurveys = await surveyCollection.insertMany(mockSurveys);
      await surveyResultCollection.insertOne({
        surveyId: addedSurveys.insertedIds[0],
        accountId: new ObjectId(accountId),
        answer: mockSurveys[0].answers[0].answer,
        date: new Date()
      });
      const sut = makeSut();

      const surveys = await sut.loadAll(accountId);

      expect(surveys.length).toBe(2);
      expect(surveys[0].id).toBeTruthy();
      expect(surveys[0].question).toBe('any_question');
      expect(surveys[0].didAnswer).toBe(true);
      expect(surveys[1].question).toBe('other_question');
      expect(surveys[1].didAnswer).toBe(false);
    });

    test('should load an empty list', async () => {
      const accountId = await mockAccountId();
      const sut = makeSut();
      const surveys = await sut.loadAll(accountId);
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

  describe('checkById()', () => {
    test('should return true if survey exists', async () => {
      const response = await surveyCollection.insertOne(mockAddSurveyParams());
      const sut = makeSut();
      const id = String(response.insertedId);

      const exists = await sut.checkById(id);

      expect(exists).toBe(true);
    });

    test('should return false if survey does not exist', async () => {
      const sut = makeSut();

      const exists = await sut.checkById(new ObjectId().toHexString());

      expect(exists).toBe(false);
    });
  });
});
