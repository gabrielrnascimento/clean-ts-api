import { type SurveyModel } from '@/domain/models';
import { type CheckSurveyById, type AddSurvey, type LoadSurveys, type LoadAnswersBySurvey } from '@/domain/usecases';

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

export class LoadAnswersBySurveySpy implements LoadAnswersBySurvey {
  public surveyId: string;
  public result = mockSurveyModel().answers.map(item => item.answer);

  async loadAnswers (surveyId: string): Promise<LoadAnswersBySurvey.Result> {
    this.surveyId = surveyId;
    return this.result;
  }
}

export class CheckSurveyByIdSpy implements CheckSurveyById {
  public surveyId: string;
  public result = true;

  async checkById (surveyId: string): Promise<CheckSurveyById.Result> {
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
