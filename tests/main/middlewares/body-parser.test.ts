import request from 'supertest';
import { setupApp } from '@/main/config/app';
import { type Express } from 'express';

let app: Express;

describe('BodyParserMiddleware', () => {
  beforeAll(async () => {
    app = await setupApp();
  });

  test('should parse body as json', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body);
    });
    await request(app)
      .post('/test_body_parser')
      .send({ name: 'Gabriel' })
      .expect({ name: 'Gabriel' });
  });
});
