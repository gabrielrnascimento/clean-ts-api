import { type EmailValidator } from '@/validation/protocols';

export class EmailValidatorSpy implements EmailValidator {
  public email: string;
  public result: boolean = true;

  isValid (email: string): boolean {
    this.email = email;
    return this.result;
  }
}
