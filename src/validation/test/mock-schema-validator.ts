import { type SchemaValidator } from '@/validation/protocols/schema-validator';

export class SchemaValidatorSpy implements SchemaValidator {
  public field: any;
  public result: string = null;

  validateSchema (field: any): string {
    this.field = field;
    return this.result;
  }
}
