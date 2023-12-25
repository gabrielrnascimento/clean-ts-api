import { mockLogErrorRepository } from '@/data/test';
import { LogControllerDecorator } from './log-controller-decorator';
import { type LogErrorRepository } from '@/data/protocols/db/log/log-error-repository';
import { mockAccountModel } from '@/domain/test';
import { ok, serverError } from '@/presentation/helpers/http/http-helper';
import { type Controller, type HttpRequest, type HttpResponse } from '@/presentation/protocols';

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await new Promise(resolve => { resolve(ok(mockAccountModel())); });
    }
  }
  return new ControllerStub();
};

const mockRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
});

const mockServerError = (): HttpResponse => {
  const mockError = new Error();
  mockError.stack = 'any_stack';
  return serverError(mockError);
};

type SutTypes = {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
};

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = mockLogErrorRepository();
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub);
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  };
};

describe('LogControllerDecorator', () => {
  test('should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    await sut.handle(mockRequest());
    expect(handleSpy).toHaveBeenCalledWith(mockRequest());
  });

  test('should return the same result of the controller', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(mockRequest());
    expect(httpResponse).toEqual(ok(mockAccountModel()));
  });

  test('should call LogErrorRepository with correct error if controller returns 500', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => { resolve(mockServerError()); }));
    const logErrorSpy = jest.spyOn(logErrorRepositoryStub, 'logError');
    await sut.handle(mockRequest());
    expect(logErrorSpy).toHaveBeenCalledWith('any_stack');
  });
});
