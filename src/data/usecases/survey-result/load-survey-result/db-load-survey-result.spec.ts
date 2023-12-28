import { mockLoadSurveyResultRepository } from '@/data/test/mock-db-survey-result';
import { DbLoadSurveyResult } from './db-load-survey-result';
import { type LoadSurveyResultRepository } from './db-load-survey-result-protocols';

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
});
