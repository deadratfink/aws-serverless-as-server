import { APIGatewayEvent, APIGatewayProxyResult, Context, Handler } from 'aws-lambda';
import { NextFunction, Request, Response } from 'express';

/**
 * Factory function providing a serverless function runtime middleware.
 *
 * @param handler - The serverless handler function.
 * @returns - The middleware which executes the handler function.
 */
export function createRunHandlerMiddleware(handler: Handler): (req: Request, res: Response, next: NextFunction) => void {
  return function runHandlerMiddleware(req: Request, res: Response, next: NextFunction): void {
    const apiGatewayEvent = (req as unknown as Record<string, unknown>).apiGatewayEvent as APIGatewayEvent;
    if (apiGatewayEvent) {
      const context: Context = {
        callbackWaitsForEmptyEventLoop: false,
        functionName: handler.name,
        functionVersion: 'unsupported',
        invokedFunctionArn: 'unsupported',
        memoryLimitInMB: '1024',
        awsRequestId: apiGatewayEvent.requestContext.requestId,
        logGroupName: 'unsupported',
        logStreamName: 'unsupported',
        getRemainingTimeInMillis: (): number => 120000,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        done: (err?: Error, result?: any): void => {
          if (err) {
            next(err);
          } else {
            (res as unknown as Record<string, unknown>).apiGatewayProxyResult = {
              statusCode: 200,
              body: typeof result === 'object' ? JSON.stringify(result) : result,
            };
            if (typeof result === 'object') {
              ((res as unknown as Record<string, unknown>).apiGatewayProxyResult as unknown as Record<string, unknown>).headers = {
                'Content-Type': 'application/json',
              };
            } else {
              ((res as unknown as Record<string, unknown>).apiGatewayProxyResult as unknown as Record<string, unknown>).headers = {
                'Content-Type': 'text/plain',
              };
            }
            next();
          }
        },
        fail: (err: Error | string): void => {
          next(err);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        succeed: (messageOrObject: any): void => {
          (res as unknown as Record<string, unknown>).apiGatewayProxyResult = {
            statusCode: req.method === 'post' ? 201 : 200,
            body: typeof messageOrObject === 'object' ? JSON.stringify(messageOrObject) : messageOrObject,
          };
          if (typeof messageOrObject === 'object') {
            ((res as unknown as Record<string, unknown>).apiGatewayProxyResult as unknown as Record<string, unknown>).headers = {
              'Content-Type': 'application/json',
            };
          } else {
            ((res as unknown as Record<string, unknown>).apiGatewayProxyResult as unknown as Record<string, unknown>).headers = {
              /* Unfortunately, we can only guess here! */
              'Content-Type': 'text/plain',
            };
          }
          next();
        },
      };

      if (handler.length <= 2) {
        /* Async handler detected! */
        (handler(apiGatewayEvent, context, () => undefined) as Promise<APIGatewayProxyResult>)
          .then(result => {
            (res as unknown as Record<string, unknown>).apiGatewayProxyResult = result;
            next();
          })
          .catch(next);
      } else {
        handler(apiGatewayEvent, context, (err, result): void => {
          if (err) {
            next(err);
          } else {
            (res as unknown as Record<string, unknown>).apiGatewayProxyResult = result;
            next();
          }
        });
      }
    } else {
      next(new Error('AWS APIGatewayEvent for Lambda handler execution not found!'));
      return;
    }
  };
}
