import { type SaveSurveyResultRepository, type SaveSurveyResult, type SaveSurveyResultParams, type LoadSurveyResultRepository, type SurveyResultModel } from './db-save-survey-result-protocols';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(data);
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(data.surveyId);
    return surveyResult;
  }
}
