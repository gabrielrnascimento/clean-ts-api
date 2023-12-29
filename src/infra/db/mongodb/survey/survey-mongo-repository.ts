import { type AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository';
import { type LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository';
import { type SurveyModel } from '@/domain/models/survey';
import { type AddSurveyParams } from '@/domain/usecases/survey/add-survey';
import { type LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import { MongoHelper, QueryBuilder } from '@/infra/db/mongodb/helpers';

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyById {
  async add (surveyData: AddSurveyParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.insertOne(surveyData);
  }

  async loadAll (accountId: string): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys');

    const query = new QueryBuilder()
      .lookup({
        from: 'surveyResults',
        foreignField: 'surveyId',
        localField: '_id',
        as: 'result'
      })
      .project({
        _id: 1,
        question: 1,
        answers: 1,
        date: 1,
        didAnswer: {
          $gte: [{
            $size: {
              $filter: {
                input: '$result',
                as: 'item',
                cond: {
                  $eq: [
                    '$$item.accountId',
                    MongoHelper.convertToObjectId(accountId)
                  ]
                }
              }
            }
          }, 1]
        }
      })
      .build();

    const surveys = await surveyCollection.aggregate(query).toArray();
    return MongoHelper.mapArray(surveys);
  }

  async loadById (id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const survey = await surveyCollection.findOne({ _id: MongoHelper.convertToObjectId(id) });
    return survey && MongoHelper.map(survey);
  }
}
