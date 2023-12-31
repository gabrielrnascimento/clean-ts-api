import { InvalidParamError } from '@/presentation/errors';
import { type Validation } from '@/presentation/protocols';
import { type EmailValidator } from '@/validation/protocols';

export class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) { }

  validate (input: any): Error {
    const isValid = this.emailValidator.isValid(input[this.fieldName] as string);
    if (!isValid) {
      return new InvalidParamError(this.fieldName);
    }
  }
}
