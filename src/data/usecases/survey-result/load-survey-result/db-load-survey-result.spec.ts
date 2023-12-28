import { DbLoadSurveyResult } from './db-load-survey-result';
import { type LoadSurveyResultRepository, type SurveyResultModel } from './db-load-survey-result-protocols';
import { mockSurveyResultModel } from '@/domain/test';

describe('DbLoadSurveyResult', () => {
  test('should call LoadSurveyResultRepository with correct values', async () => {
    class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
      async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
        return await Promise.resolve(mockSurveyResultModel());
      }
    }
    const loadSurveyResultRepositoryStub = new LoadSurveyResultRepositoryStub();
    const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub);
    const loadSurveyByIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId');
    await sut.load('any_survey_id');
    expect(loadSurveyByIdSpy).toHaveBeenCalledWith('any_survey_id');
  });
});
