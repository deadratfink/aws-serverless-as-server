import { APIGatewayAuthorizerEvent, APIGatewayAuthorizerResult, APIGatewaySimpleAuthorizerWithContextResult, APIGatewayTokenAuthorizerEvent, Context } from 'aws-lambda';
import { NextFunction, Request, Response } from 'express';
import { IServerlessOptions } from './interfaces';

function sendErrorResponse(err: Error, res: Response, status = 401): void {
  res.status(status).send({
    error: {
      errors: [
        {
          message: err.message
        }
      ]
    },
    status,
  });
}

/**
 * Factory function providing a serverless authorizer function runtime middleware.
 *
 * @param authorizerHandler - The serverless authorizer handler function.
 * @returns - The middleware which executes the handler function.
 */
export function createRunAuthorizerHandlerMiddleware(
  serverlessOptions: Required<IServerlessOptions>,
): (req: Request, res: Response, next: NextFunction) => void {
  return function runAuthorizerHandlerMiddleware(req: Request, res: Response, next: NextFunction): void {
    const context = {} as Context; // TODO: create Context for authorizer?
    let authorizerEvent: APIGatewayAuthorizerEvent;
    if (serverlessOptions.authorizerHandlerInfo!.authorizerEventPayload!.token) {
      const tokenSource = serverlessOptions.authorizerHandlerInfo!.authorizerEventPayload!.token.header!;
      authorizerEvent = {
        type: 'TOKEN',
        authorizationToken: req.header(tokenSource) as string,
        methodArn: `arn:aws:execute-api:${serverlessOptions.awsRegion}:${serverlessOptions.awsAccountId}:${serverlessOptions.apiId}/${serverlessOptions.stage}/${req.method.toUpperCase}${req.path}`,
      };
    } else {
      
    }

    const authorizerHandler = serverlessOptions.authorizerHandlerInfo.authorizerHandler!;
    const authorizerPayloadFormatVersion = serverlessOptions.authorizerHandlerInfo.authorizerPayloadFormatVersion!;

    if (authorizerHandler.length <= 2) {
      (authorizerHandler(authorizerEvent, context, () => undefined) as Promise<APIGatewayAuthorizerResult>)
        .then((result: any) => {
          if (authorizerPayloadFormatVersion === '1.0') {

          } else {
            if (result.isAuthorized === undefined) {
              /* IAM policy. */
              const statement = (result as APIGatewayAuthorizerResult).policyDocument.Statement;
              if (statement.find((statement: any) => {
                return statement.Action === 'execute-api:Invoke' && (((Array.isArray(statement.NotResource) ? (statement.NotResource as string[]).includes(authorizerEvent.methodArn) : statement.NotResource === authorizerEvent.methodArn) && statement.Effect === 'Allow')
                || ((Array.isArray(statement.NotResource) ? (statement.NotResource as string[]).includes(tokenAuthorizerEvent.methodArn) : statement.NotResource === authorizerEvent.methodArn) && statement.Effect === 'Deny'));
              })) {
                (res as unknown as Record<string, unknown>).authorizerContext = result.context;
                next();
              } else {
                sendErrorResponse(new Error('Unauthorized'), res);
              }
            } else {
              /* Simple response. */
              if ((result as APIGatewaySimpleAuthorizerWithContextResult<any>).isAuthorized) {
                (res as unknown as Record<string, unknown>).authorizerContext = result.context;
                next();
              } else {
                sendErrorResponse(new Error('Unauthorized'), res);
              }
            }
          }
        })
        .catch(next);
    } else {
      authorizerHandler(tokenAuthorizerEvent, context, (err, result) => {
        if (err) {
          next(err);
        } else {
          (res as unknown as Record<string, unknown>).apiGatewayProxyResult = result;
          next();
        }
      });
    }


    'application/json': ''
  };
}
