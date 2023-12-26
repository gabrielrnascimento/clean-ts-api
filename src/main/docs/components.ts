import { apiKeyAuthSchema } from './schemas/';
import {
  badRequestComponent,
  forbiddenComponent,
  notFoundComponent,
  serverErrorComponent,
  unauthorizedComponent
} from './components/';

export default {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema
  },
  badRequest: badRequestComponent,
  unauthorized: unauthorizedComponent,
  forbidden: forbiddenComponent,
  notFound: notFoundComponent,
  serverError: serverErrorComponent
};
