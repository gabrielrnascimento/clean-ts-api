import { mockAddSurveyRepository } from '@/data/test';
import { DbAddSurvey } from './db-add-survey';
import { type AddSurveyRepository } from './db-add-survey-protocols';
import MockDate from 'mockdate';
import { mockAddSurveyParams } from '@/domain/test';

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
};

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = mockAddSurveyRepository();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);
  return {
    sut,
    addSurveyRepositoryStub
  };
};

describe('DbAddSurvey', () => {
  beforeAll(() => {
    MockDate.set(new Date());
  });

  afterAll(() => {
    MockDate.reset();
  });

  test('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');
    const addSurveyParams = mockAddSurveyParams();
    await sut.add(addSurveyParams);
    expect(addSpy).toHaveBeenCalledWith(addSurveyParams);
  });

  test('should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();
    jest.spyOn(addSurveyRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()));
    const promise = sut.add(mockAddSurveyParams());
    await expect(promise).rejects.toThrow();
  });
});
