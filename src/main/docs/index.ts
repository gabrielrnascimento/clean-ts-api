import { badRequestComponent, forbiddenComponent, notFoundComponent, serverErrorComponent, unauthorizedComponent } from './components';
import { loginPath, surveyPath } from './paths';
import { accountSchema, loginParamsSchema, errorSchema, surveySchema, surveysSchema, surveyAnswerSchema, apiKeyAuthSchema } from './schemas';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API do curso do Mango para realizar enquetes entre programadores',
    version: '1.0.0'
  },
  servers: [{
    url: '/api'
  }],
  tags: [
    {
      name: 'Login'
    },
    {
      name: 'Enquete'
    }
  ],
  paths: {
    '/login': loginPath,
    '/surveys': surveyPath
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema,
    error: errorSchema,
    surveyAnswer: surveyAnswerSchema,
    survey: surveySchema,
    surveys: surveysSchema
  },
  components: {
    securitySchemes: {
      apiKeyAuth: apiKeyAuthSchema
    },
    badRequest: badRequestComponent,
    unauthorized: unauthorizedComponent,
    forbidden: forbiddenComponent,
    notFound: notFoundComponent,
    serverError: serverErrorComponent
  }
};
