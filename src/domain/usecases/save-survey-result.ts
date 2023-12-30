import { type SurveyResultModel } from '../models';

export interface SaveSurveyResult {
  save: (saveSurveyResultParams: SaveSurveyResult.Params) => Promise<SaveSurveyResult.Result>
}

export namespace SaveSurveyResult {
  export type Params = {
    surveyId: string
    accountId: string
    answer: string
    date: Date
  };

  export type Result = SurveyResultModel;
}
