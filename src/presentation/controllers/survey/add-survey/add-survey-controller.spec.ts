import { badRequest } from '../../access/signup/signup-controller-protocols';
import { AddSurveyController } from './add-survey-controller';
import { type Validation, type HttpRequest } from './add-survey-controller-protocols';

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  }
});

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null;
    }
  }
  return new ValidationStub();
};

interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
};

const makeSut = (): SutTypes => {
  const validationStub = makeValidation();
  const sut = new AddSurveyController(validationStub);
  return {
    sut,
    validationStub
  };
};

describe('AddSurveyController', () => {
  test('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut();
    const validateSpy = jest.spyOn(validationStub, 'validate');
    const httpRequest = makeFakeRequest();
    await sut.handle(httpRequest);
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});

test('should return 400 if validation fails', async () => {
  const { sut, validationStub } = makeSut();
  jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error());
  const httpResponse = await sut.handle(makeFakeRequest());
  expect(httpResponse).toEqual(badRequest(new Error()));
});
