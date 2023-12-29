import { noContent } from '@/presentation/helpers';
import { type HttpResponse, type Controller, type HttpRequest } from '@/presentation/protocols';

export class ControllerSpy implements Controller {
  public httpRequest: HttpRequest;
  public result: HttpResponse = noContent();

  async handle (httpRequest: any): Promise<any> {
    this.httpRequest = httpRequest;
    return this.result;
  }
}
