import { mockSurveyModel, mockSurveyModels } from '@/domain/test';
import { type AddSurveyRepository } from '../protocols/db/survey/add-survey-repository';
import { type LoadSurveyByIdRepository } from '../protocols/db/survey/load-survey-by-id-repository';
import { type AddSurveyParams } from '../usecases/survey/add-survey/db-add-survey-protocols';
import { type SurveyModel } from '../usecases/survey/load-survey-by-id/db-load-survey-by-id-protocols';
import { type LoadSurveysRepository } from '../protocols/db/survey/load-surveys-repository';

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  public addSurveyParams: AddSurveyParams;

  async add (addSurveyParams: AddSurveyParams): Promise<void> {
    this.addSurveyParams = addSurveyParams;
    return null;
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  public surveyId: string;
  public result: SurveyModel = mockSurveyModel();

  async loadById (surveyId: string): Promise<SurveyModel> {
    this.surveyId = surveyId;
    return this.result;
  }
}

export class LoadSurveysRepositorySpy implements LoadSurveysRepository {
  public loadAllCalls: number = 0;
  public result = mockSurveyModels();

  async loadAll (): Promise<SurveyModel[]> {
    this.loadAllCalls++;
    return this.result;
  }
}
