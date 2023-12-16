import { type Request, type Response } from 'express';
import { type HttpRequest, type Controller } from '../../presentation/protocols';

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response): Promise<void> => {
    const httpRequest: HttpRequest = {
      body: req.body
    };
    const httpResponse = await controller.handle(httpRequest);
    if (httpResponse.statusCode >= 200 || httpResponse.statusCode <= 299) {
      res.status(httpResponse.statusCode).json(httpResponse.body);
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      });
    }
  };
};
