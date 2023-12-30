import { type SurveyModel } from '@/domain/models';
import { MongoHelper } from './mongo-helper';
import { QueryBuilder } from './query-builder';
import { type LoadSurveyByIdRepository, type AddSurveyRepository, type LoadSurveysRepository } from '@/data/protocols/db/survey';

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async add (surveyData: AddSurveyRepository.Params): Promise<void> {
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
