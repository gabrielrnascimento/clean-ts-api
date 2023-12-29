import { mockSurveyResultModel } from '@/domain/test';
import { type SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository';
import { type SaveSurveyResultParams, type SurveyResultModel } from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result-protocols';
import { type LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository';

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  public data: SaveSurveyResultParams;

  async save (data: SaveSurveyResultParams): Promise<null> {
    this.data = data;
    return null;
  }
}

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
  public surveyId: string;
  public result = mockSurveyResultModel();

  async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId;
    return this.result;
  }
}
