import { type SurveyModel } from '../models';

export interface LoadSurveyById {
  loadById: (surveyId: string) => Promise<LoadSurveyById.Result>
}

export namespace LoadSurveyById {
  export type Result = SurveyModel;
}
