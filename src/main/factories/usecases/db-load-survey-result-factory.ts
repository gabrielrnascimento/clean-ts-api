import { DbLoadSurveyResult } from '@/data/usecases/db-load-survey-result';
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result-mongo-repository';
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey-mongo-repository';

export const makeDbLoadSurveyResult = (): DbLoadSurveyResult => {
  const surveyResultMongoRepository = new SurveyResultMongoRepository();
  const surveyMongoRepository = new SurveyMongoRepository();
  const dbLoadSurveyResult = new DbLoadSurveyResult(surveyResultMongoRepository, surveyMongoRepository);
  return dbLoadSurveyResult;
};
