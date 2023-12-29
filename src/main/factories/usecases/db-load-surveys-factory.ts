import { DbLoadSurveys } from '@/data/usecases/db-load-surveys';
import { type LoadSurveys } from '@/domain/usecases/load-surveys';
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey-mongo-repository';

export const makeDbLoadSurveys = (): LoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadSurveys(surveyMongoRepository);
};
