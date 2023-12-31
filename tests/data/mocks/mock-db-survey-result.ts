import { mockSurveyResultModel } from '../../domain/mocks';
import { type SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository';
import { type LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository';
import { type SurveyResultModel } from '@/domain/models';

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  public saveSurveyResultParams: SaveSurveyResultRepository.Params;

  async save (saveSurveyResultParams: SaveSurveyResultRepository.Params): Promise<void> {
    this.saveSurveyResultParams = saveSurveyResultParams;
    return null;
  }
}

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
  public surveyId: string;
  public accountId: string;
  public result = mockSurveyResultModel();

  async loadBySurveyId (surveyId: string, accountId: string): Promise<SurveyResultModel> {
    this.surveyId = surveyId;
    this.accountId = accountId;
    return this.result;
  }
}
