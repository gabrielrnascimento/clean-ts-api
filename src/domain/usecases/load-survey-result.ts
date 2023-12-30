import { type SurveyResultModel } from '../models';

export interface LoadSurveyResult {
  load: (surveyId: string, accountId: string) => Promise<SurveyResultModel>
}
