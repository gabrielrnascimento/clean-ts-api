import { type SurveyResultModel } from '../models';

export interface LoadSurveyResult {
  load: (surveyId: string, accountId: string) => Promise<LoadSurveyResult.Result>
}

export namespace LoadSurveyResult {
  export type Result = SurveyResultModel;
}
