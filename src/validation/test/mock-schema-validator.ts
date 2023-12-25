import { type SchemaValidator } from '@/validation/protocols/schema-validator';

export const mockSchemaValidator = (): SchemaValidator => {
  class SchemaValidatorStub implements SchemaValidator {
    validateSchema (field: any): string {
      return null;
    }
  }
  return new SchemaValidatorStub();
};
