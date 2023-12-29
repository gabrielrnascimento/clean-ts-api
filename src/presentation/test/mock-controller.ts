import { type HttpResponse, type Controller, type HttpRequest } from '@/presentation/protocols';
import { noContent } from '../helpers/http/http-helper';

export class ControllerSpy implements Controller {
  public httpRequest: HttpRequest;
  public result: HttpResponse = noContent();

  async handle (httpRequest: any): Promise<any> {
    this.httpRequest = httpRequest;
    return this.result;
  }
}
