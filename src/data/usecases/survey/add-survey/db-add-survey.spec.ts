import { AddSurveyRepositorySpy } from '@/data/test';
import { DbAddSurvey } from './db-add-survey';
import { mockAddSurveyParams, throwError } from '@/domain/test';
import MockDate from 'mockdate';

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositorySpy: AddSurveyRepositorySpy
};

const makeSut = (): SutTypes => {
  const addSurveyRepositorySpy = new AddSurveyRepositorySpy();
  const sut = new DbAddSurvey(addSurveyRepositorySpy);
  return {
    sut,
    addSurveyRepositorySpy
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
    const { sut, addSurveyRepositorySpy } = makeSut();
    const addSurveyParams = mockAddSurveyParams();
    await sut.add(addSurveyParams);
    expect(addSurveyRepositorySpy.addSurveyParams).toEqual(addSurveyParams);
  });

  test('should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut();
    jest.spyOn(addSurveyRepositorySpy, 'add').mockImplementationOnce(throwError);
    const promise = sut.add(mockAddSurveyParams());
    await expect(promise).rejects.toThrow();
  });
});
