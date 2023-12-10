import { badRequest } from '../../access/signup/signup-controller-protocols';
import { type HttpResponse, type Controller, type HttpRequest, type Validation } from './add-survey-controller-protocols';

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const error = this.validation.validate(httpRequest.body);
    if (error) return badRequest(error);
    return null;
  }
}
