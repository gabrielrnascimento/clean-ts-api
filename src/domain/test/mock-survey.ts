import { type SurveyModel } from '@/domain/models/survey';
import { type AddSurvey, type AddSurveyParams } from '@/domain/usecases/survey/add-survey';
import { type LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id';
import { type LoadSurveys } from '@/domain/usecases/survey/load-surveys';

export const mockAddSurveyParams = (): AddSurveyParams => ({
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
  public data: AddSurveyParams;

  async add (data: AddSurveyParams): Promise<void> {
    this.data = data;
    return null;
  }
}

export class LoadSurveyByIdSpy implements LoadSurveyById {
  public id: string;
  public result = mockSurveyModel();

  async loadById (id: string): Promise<SurveyModel> {
    this.id = id;
    return this.result;
  }
}

export class LoadSurveysSpy implements LoadSurveys {
  public loadCalls = 0;
  public result = mockSurveyModels();

  async load (): Promise<SurveyModel[]> {
    this.loadCalls++;
    return this.result;
  }
}
