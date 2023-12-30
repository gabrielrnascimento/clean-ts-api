import { type SurveyModel } from '@/domain/models/survey';
import { type AddSurvey, type LoadSurveyById, type LoadSurveys } from '@/domain/usecases';

export const mockAddSurveyParams = (): AddSurvey.Params => ({
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
});

export const mockSurveyModel = (): SurveyModel => {
  return {
    id: 'any_survey_id',
    question: 'any_question',
    answers: [{
      answer: 'any_answer',
      image: 'any_image'
    }, {
      answer: 'other_answer'
    }],
    date: new Date()
  };
};

export const mockSurveyModels = (): SurveyModel[] => {
  return [{
    id: 'any_id',
    question: 'any_question',
    answers: [{
      answer: 'any_answer',
      image: 'any_image'
    }],
    date: new Date()
  }, {
    id: 'other_id',
    question: 'other_question',
    answers: [{
      answer: 'other_answer',
      image: 'other_image'
    }],
    date: new Date()
  }];
};

export class AddSurveySpy implements AddSurvey {
  public surveyData: AddSurvey.Params;

  async add (surveyData: AddSurvey.Params): Promise<void> {
    this.surveyData = surveyData;
    return null;
  }
}

export class LoadSurveyByIdSpy implements LoadSurveyById {
  public surveyId: string;
  public result = mockSurveyModel();

  async loadById (surveyId: string): Promise<SurveyModel> {
    this.surveyId = surveyId;
    return this.result;
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  public accountId: string;
  public result = mockSurveyModels();

  async load (accountId: string): Promise<SurveyModel[]> {
    this.accountId = accountId;
    return this.result;
  }
}
