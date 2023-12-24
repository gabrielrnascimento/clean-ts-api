import { type Validation } from '@/presentation/protocols';
import { type SchemaValidator } from '../protocols/schema-validator';
import { InvalidSchemaError } from '@/presentation/errors/invalid-schema-error';

export class SchemaValidation implements Validation {
  constructor (private readonly schemaValidator: SchemaValidator) { }

  validate (input: any): Error {
    const errorMessage = this.schemaValidator.validateSchema(input);
    if (errorMessage) return new InvalidSchemaError(errorMessage);
    return null;
  }
}
