import { type AddSurveyParams } from '@/domain/usecases';

export interface AddSurveyRepository {
  add: (addSurveyParams: AddSurveyParams) => Promise<void>
}
