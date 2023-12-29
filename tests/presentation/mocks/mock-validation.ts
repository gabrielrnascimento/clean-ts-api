import { type Validation } from '@/presentation/protocols';

export class ValidationSpy implements Validation {
  public input: any;
  public result: Error = null;

  validate (input: any): Error {
    this.input = input;
    return this.result;
  }
}
