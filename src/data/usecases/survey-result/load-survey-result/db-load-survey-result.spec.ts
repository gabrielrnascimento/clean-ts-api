import { DbLoadSurveyResult } from './db-load-survey-result';
import { type LoadSurveyResultRepository } from './db-load-survey-result-protocols';
import { mockLoadSurveyResultRepository } from '@/data/test';
import { mockSurveyResultModel, throwError } from '@/domain/test';

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
};

const makeSut = (): SutTypes => {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository();
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub);
  return {
    sut,
    loadSurveyResultRepositoryStub
  };
};

describe('DbLoadSurveyResult', () => {
  test('should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    const loadSurveyByIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId');
    await sut.load('any_survey_id');
    expect(loadSurveyByIdSpy).toHaveBeenCalledWith('any_survey_id');
  });

  test('should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut();
    jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId').mockImplementationOnce(throwError);
    const promise = sut.load('any_survey_id');
    await expect(promise).rejects.toThrow();
  });

  test('should return a surveyResult on success', async () => {
    const { sut } = makeSut();
    const surveyResult = await sut.load('any_survey_id');
    expect(surveyResult).toEqual(mockSurveyResultModel());
  });
});
