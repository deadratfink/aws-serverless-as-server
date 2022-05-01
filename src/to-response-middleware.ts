import { APIGatewayProxyResult } from 'aws-lambda';
import { NextFunction, Request, Response } from 'express';

/**
 *
 * @param req - The Express.js request (not used here).
 * @param res - The Express.js response.
 */
export function awsApiGatewayProxyResultToExpressResponse(req: Request, res: Response, next: NextFunction): void {
  const apiGatewayProxyResult = (res as unknown as Record<string, unknown>).apiGatewayProxyResult as APIGatewayProxyResult;
  if (apiGatewayProxyResult) {
    console.log('ApiGatewayProxyResult:', apiGatewayProxyResult);
  } else {
    next(new Error('APIGatewayProxyResult for response not found!'));
    return;
  }

  if (apiGatewayProxyResult.headers) {
    for (const [key, value] of Object.entries(apiGatewayProxyResult.headers)) {
      res.set(key, `${value}`);
    }
  }

  if (apiGatewayProxyResult.multiValueHeaders) {
    for (const [key, values] of Object.entries(apiGatewayProxyResult.multiValueHeaders)) {
      res.append(
        key,
        values.map(value => `${value}`),
      );
    }
  }

  const body = apiGatewayProxyResult.body;
  const contentType = apiGatewayProxyResult.headers ? apiGatewayProxyResult.headers['Content-Type'] : undefined;
  if (body) {
    if (apiGatewayProxyResult.isBase64Encoded) {
      apiGatewayProxyResult.body = Buffer.from(body, 'base64').toString('utf-8');
    }
    if (body && contentType === 'application/json') {
      apiGatewayProxyResult.body = JSON.parse(body);
    }
  }

  res.status(apiGatewayProxyResult.statusCode ?? 200).send(apiGatewayProxyResult.body);
}
