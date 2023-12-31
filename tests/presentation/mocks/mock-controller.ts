import { noContent } from '@/presentation/helpers';
import { type HttpResponse, type Controller } from '@/presentation/protocols';

export class ControllerSpy implements Controller<any> {
  public request: any;
  public result: HttpResponse = noContent();

  async handle (request: any): Promise<any> {
    this.request = request;
    return this.result;
  }
}
