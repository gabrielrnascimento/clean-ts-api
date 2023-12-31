import { type LoadAnswersBySurvey } from '@/domain/usecases';
import { type LoadAnswersBySurveyRepository } from '../protocols/db/survey';

export class DbLoadAnswersBySurvey implements LoadAnswersBySurvey {
  constructor (private readonly loadAnswersBySurveyRepository: LoadAnswersBySurveyRepository) {}

  async loadAnswers (id: string): Promise<LoadAnswersBySurvey.Result> {
    return await this.loadAnswersBySurveyRepository.loadAnswers(id);
  }
}
