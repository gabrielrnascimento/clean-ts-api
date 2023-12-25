import { mockSurveyResultModel } from '@/domain/test';
import { type SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository';
import { type SaveSurveyResultParams, type SurveyResultModel } from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result-protocols';

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return await Promise.resolve(mockSurveyResultModel());
    }
  }
  return new SaveSurveyResultRepositoryStub();
};
