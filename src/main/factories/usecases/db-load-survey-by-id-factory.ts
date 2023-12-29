import { DbLoadSurveyById } from '@/data/usecases/db-load-survey-by-id';
import { type LoadSurveyById } from '@/domain/usecases/load-survey-by-id';
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey-mongo-repository';

export const makeDbLoadSurveyById = (): LoadSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadSurveyById(surveyMongoRepository);
};
