import { DbAddSurvey } from '@/data/usecases/db-add-survey';
import { type AddSurvey } from '@/domain/usecases/add-survey';
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey-mongo-repository';

export const makeDbAddSurvey = (): AddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbAddSurvey(surveyMongoRepository);
};
