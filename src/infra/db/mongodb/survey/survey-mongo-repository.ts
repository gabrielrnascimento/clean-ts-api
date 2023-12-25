import { type AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository';
import { type LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository';
import { type SurveyModel } from '@/domain/models/survey';
import { type AddSurveyParams } from '@/domain/usecases/survey/add-survey';
import { type LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper';

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyById {
  async add (surveyData: AddSurveyParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.insertOne(surveyData);
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const surveys = await surveyCollection.find().toArray();
    return MongoHelper.mapArray(surveys);
  }

  async loadById (id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    const survey = await surveyCollection.findOne({ _id: MongoHelper.convertToObjectId(id) });
    return survey && MongoHelper.map(survey);
  }
}
