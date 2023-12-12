import { DbAddSurvey } from './db-add-survey';
import { type AddSurveyRepository, type AddSurveyModel } from './db-add-survey-protocols';

const makeFakeSurveyData = (): AddSurveyModel => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }]
});

describe('DbAddSurvey', () => {
  test('should call AddSurveyRepository with correct values', async () => {
    class AddSurveyRepositoryStub implements AddSurveyRepository {
      async add (surveyData: AddSurveyModel): Promise<void> {
        await Promise.resolve();
      }
    }
    const addSurveyRepositoryStub = new AddSurveyRepositoryStub();
    const sut = new DbAddSurvey(addSurveyRepositoryStub);
    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');
    const surveyData = makeFakeSurveyData();
    await sut.add(surveyData);
    expect(addSpy).toHaveBeenCalledWith(surveyData);
  });
});
