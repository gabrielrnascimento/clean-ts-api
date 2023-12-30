import { type LoadAnswersBySurvey } from '@/domain/usecases';
import { type LoadSurveyByIdRepository } from '../protocols/db/survey';

export class DbLoadAnswersBySurvey implements LoadAnswersBySurvey {
  constructor (private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}

  async loadAnswers (id: string): Promise<LoadAnswersBySurvey.Result> {
    const survey = await this.loadSurveyByIdRepository.loadById(id);
    return survey?.answers.map(item => item.answer) || [];
  }
}
