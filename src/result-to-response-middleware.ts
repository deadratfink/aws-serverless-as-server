import { APIGatewayProxyResult } from 'aws-lambda';
import { NextFunction, Request, Response } from 'express';

/**
 * Middleware which turns the AWS `APIGatewayEvent` (from `res.apiGatewayEvent` property)
 * into an  Express `Request` body, status code and headers and finally, sends it to requestor.
 *
 * @param req - The request (not used here!).
 * @param res - The response.
 * @param next - The next function.
 */
export function resultToResponseMiddleware(req: Request, res: Response, next: NextFunction): void {
  const apiGatewayProxyResult = (res as unknown as Record<string, unknown>).apiGatewayProxyResult as APIGatewayProxyResult;
  if (apiGatewayProxyResult) {
    console.log('ApiGatewayProxyResult:', apiGatewayProxyResult);
  } else {
    next(new Error('APIGatewayProxyResult for response not found!'));
    return;
  }

  const { body, headers, multiValueHeaders, isBase64Encoded, statusCode } = apiGatewayProxyResult;

  if (headers) {
    for (const [key, value] of Object.entries(headers)) {
      res.set(key, `${value}`);
    }
  }

  if (multiValueHeaders) {
    for (const [key, values] of Object.entries(multiValueHeaders)) {
      res.append(
        key,
        values.map(value => `${value}`),
      );
    }
  }

  if (body) {
    if (isBase64Encoded) {
      apiGatewayProxyResult.body = Buffer.from(body, 'base64').toString('utf-8');
    }
    const contentType = headers ? headers['Content-Type'] : undefined;
    if (body && contentType === 'application/json') {
      apiGatewayProxyResult.body = JSON.parse(body);
    }
  }

  res.status(statusCode ?? 200).send(apiGatewayProxyResult.body);
}
