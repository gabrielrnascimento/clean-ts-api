import typeDefs from '../type-defs';
import resolvers from '../resolvers';
import { authDirectiveTransformer } from '../directives';

import { ApolloServer } from 'apollo-server-express';
import { type GraphQLError } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';

type CustomResponse = {
  response: any
  errors: readonly GraphQLError[]
};

const handleErrors = (response: any, errors: readonly GraphQLError[]): void => {
  errors?.forEach((error: GraphQLError) => {
    response.data = undefined;
    switch (true) {
      case checkError(error, 'UserInputError'):
        response.http.status = 400;
        break;
      case checkError(error, 'AuthenticationError'):
        response.http.status = 401;
        break;
      case checkError(error, 'ForbiddenError'):
        response.http.status = 403;
        break;
      default: response.http.status = 500;
    }
  });
};

const checkError = (error: GraphQLError, errorName: string): boolean => {
  return [error.name, error.originalError?.name].includes(errorName);
};

let schema = makeExecutableSchema({ resolvers, typeDefs });
schema = authDirectiveTransformer(schema);

export const setupApolloServer = (): ApolloServer => new ApolloServer({
  schema,
  context: ({ req }) => ({ req }),
  plugins: [{
    requestDidStart: (): any => ({
      willSendResponse: ({ response, errors }: CustomResponse) => {
        handleErrors(response, errors);
      }
    })
  }]
});
