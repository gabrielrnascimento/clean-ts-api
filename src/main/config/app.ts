import express, { type Express } from 'express';
import setupMiddlewares from './middlewares';
import setupRoutes from './routes';
import setupSwagger from './swagger';
import setupStaticFiles from './static-files';
import { setupApolloServer } from '../graphql/apollo';

export const setupApp = async (): Promise<Express> => {
  const app = express();
  const apolloServer = setupApolloServer();
  await apolloServer.start();
  setupStaticFiles(app);
  setupSwagger(app);
  setupMiddlewares(app);
  setupRoutes(app);
  apolloServer.applyMiddleware({ app });
  return app;
};
