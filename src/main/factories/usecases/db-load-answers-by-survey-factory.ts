import { DbLoadAnswersBySurvey } from '@/data/usecases';
import { type LoadAnswersBySurvey } from '@/domain/usecases';
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey-mongo-repository';

export const makeDbLoadAnswersBySurvey = (): LoadAnswersBySurvey => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadAnswersBySurvey(surveyMongoRepository);
};
