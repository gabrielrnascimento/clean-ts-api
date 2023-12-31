import { type CheckSurveyById } from '@/domain/usecases';
import { type CheckSurveyByIdRepository } from '../protocols/db/survey';

export class DbCheckSurveyById implements CheckSurveyById {
  constructor (private readonly checkSurveyByIdRepository: CheckSurveyByIdRepository) {}

  async checkById (id: string): Promise<CheckSurveyById.Result> {
    return await this.checkSurveyByIdRepository.checkById(id);
  }
}
