import express from 'express';
import setupMiddlewares from './middlewares';
import setupRoutes from './routes';
import setupSwagger from './swagger';
import setupStaticFiles from './static-files';
import setupApolloServer from './apollo-server';

const app = express();
const setupApp = async (): Promise<void> => {
  await setupApolloServer(app);
  setupStaticFiles(app);
  setupSwagger(app);
  setupMiddlewares(app);
  setupRoutes(app);
};

setupApp().catch(console.error);

export default app;
