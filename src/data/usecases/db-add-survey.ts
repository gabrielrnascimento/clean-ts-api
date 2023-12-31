import { type AddSurvey } from '@/domain/usecases';
import { type AddSurveyRepository } from '../protocols/db/survey/add-survey-repository';

export class DbAddSurvey implements AddSurvey {
  constructor (private readonly addSurveyRepository: AddSurveyRepository) {}

  async add (surveyData: AddSurvey.Params): Promise<void> {
    await this.addSurveyRepository.add(surveyData);
  }
}
