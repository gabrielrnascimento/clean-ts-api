import { type AddSurveyParams } from '@/domain/usecases/survey/add-survey';

export interface AddSurveyRepository {
  add: (addSurveyParams: AddSurveyParams) => Promise<void>
}
