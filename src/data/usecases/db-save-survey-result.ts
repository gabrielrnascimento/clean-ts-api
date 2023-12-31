import { type SaveSurveyResult } from '@/domain/usecases';
import { type SaveSurveyResultRepository } from '../protocols/db/survey-result/save-survey-result-repository';
import { type LoadSurveyResultRepository } from '../protocols/db/survey-result/load-survey-result-repository';

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async save (saveSurveyResultParams: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
    await this.saveSurveyResultRepository.save(saveSurveyResultParams);
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(
      saveSurveyResultParams.surveyId,
      saveSurveyResultParams.accountId
    );
    return surveyResult;
  }
}
