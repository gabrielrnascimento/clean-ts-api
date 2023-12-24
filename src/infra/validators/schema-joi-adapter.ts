import { type SchemaValidator } from '@/validation/protocols/schema-validator';
import { type ObjectSchema } from 'joi';

export class SchemaJoiAdapter implements SchemaValidator {
  constructor (private readonly JoiSchema: ObjectSchema) { }

  validateSchema (field: any): string {
    const response = this.JoiSchema.validate(field);
    if (response.error) return response.error.message;

    return null;
  }
}
