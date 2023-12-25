import { type SaveSurveyResultParams, type SurveyResultModel, type SaveSurveyResultRepository } from '@/data/usecases/survey-result/save-survey-result/db-save-survey-result-protocols';
import { MongoHelper } from '../helpers/mongo-helper';

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults');
    const response = await surveyResultCollection.findOneAndUpdate({
      surveyId: data.surveyId,
      accountId: data.accountId
    }, {
      $set: {
        answer: data.answer,
        date: data.date
      }
    }, {
      upsert: true,
      returnDocument: 'after'
    });

    return response.value && MongoHelper.map(response.value);
  }
}
