import { type SaveSurveyResultRepository, type SaveSurveyResult, type SaveSurveyResultParams, type LoadSurveyResultRepository, type SurveyResultModel } from './db-save-survey-result-protocols';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async save (saveSurveyResultParams: SaveSurveyResultParams): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(saveSurveyResultParams);
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(
      saveSurveyResultParams.surveyId,
      saveSurveyResultParams.accountId
    );
    return surveyResult;
  }
}
