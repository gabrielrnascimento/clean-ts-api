import typeDefs from '../graphql/type-defs';
import resolvers from '../graphql/resolvers';
import { authDirectiveTransformer } from '../graphql/directives';

import { ApolloServer } from 'apollo-server-express';
import { type Express } from 'express';
import { type GraphQLError } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';

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

export default async (app: Express): Promise<void> => {
  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({ req }),
    plugins: [{
      requestDidStart: (): any => ({
        willSendResponse: ({ response, errors }: any) => {
          handleErrors(response, errors);
        }
      })
    }]
  });
  await server.start();
  server.applyMiddleware({ app });
};
