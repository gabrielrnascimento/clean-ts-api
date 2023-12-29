import { type AddSurvey, type AddSurveyParams } from '@/domain/usecases';
import { type AddSurveyRepository } from '../protocols/db/survey/add-survey-repository';

export class DbAddSurvey implements AddSurvey {
  constructor (private readonly addSurveyRepository: AddSurveyRepository) {}

  async add (data: AddSurveyParams): Promise<void> {
    await this.addSurveyRepository.add(data);
  }
}
