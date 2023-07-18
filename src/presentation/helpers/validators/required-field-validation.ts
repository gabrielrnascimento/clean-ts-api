import { MissingParamError } from '../../errors';
import { type Validation } from './validation';

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {
    this.fieldName = fieldName;
  }

  validate (input: any): Error {
    if (!input[this.fieldName]) return new MissingParamError(this.fieldName);
  }
}
