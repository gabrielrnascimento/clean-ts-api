import typeDefs from '../graphql/type-defs';
import resolvers from '../graphql/resolvers';

import { ApolloServer } from 'apollo-server-express';
import { type Express } from 'express';
import { type GraphQLError } from 'graphql';

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

export default async (app: Express): Promise<void> => {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
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
