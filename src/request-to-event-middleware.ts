import {
  APIGatewayProxyEventHeaders,
  APIGatewayProxyEventMultiValueHeaders,
  APIGatewayProxyEventMultiValueQueryStringParameters,
  APIGatewayProxyEventQueryStringParameters,
} from 'aws-lambda';
import { NextFunction, Request, Response } from 'express';
import { join } from 'path';
import { v4 as uuidV4 } from 'uuid';
import { isSwaggerUiPath } from './utils';

/**
 * Factory function providing a middleware which turns the Express `Request` into an AWS `APIGatewayEvent` and attaches it to the `Request` as `apiGatewayEvent` property.
 *
 * @param apiId - The API ID.
 * @param accountId - The AWS account ID.
 * @returns - The middleware.
 */
export function createRequestToEventMiddleware(
  apiId: string,
  accountId: string,
): (req: Request, res: Response, next: NextFunction) => void {
  return function requestToEventMiddleware(req: Request, res: Response, next: NextFunction): void {
    if (!isSwaggerUiPath(req.path)) {
      const headers: APIGatewayProxyEventHeaders = {};
      const multiValueHeaders: APIGatewayProxyEventMultiValueHeaders = {};
      const queryStringParameters: APIGatewayProxyEventQueryStringParameters = {};
      const multiValueQueryStringParameters: APIGatewayProxyEventMultiValueQueryStringParameters = {};

      for (const [key, value] of Object.entries(req.headers)) {
        if (Array.isArray(value)) {
          multiValueHeaders[key] = value ?? undefined;
        } else {
          headers[key] = value ?? undefined;
        }
      }

      for (const [key, value] of Object.entries(req.query)) {
        if (Array.isArray(value)) {
          multiValueQueryStringParameters[key] = value as string[];
        } else {
          queryStringParameters[key] = value as string;
        }
      }

      const path = join('/', req.baseUrl, req.path);
      const httpMethod = req.method;
      const id = headers['postman-token'] ?? uuidV4();
      const requestTime = new Date();

      (req as unknown as Record<string, unknown>).apiGatewayEvent = {
        headers,
        body: req.body ?? null, // (req as unknown as Record<string, unknown>).rawBody ?? null,
        multiValueHeaders: Object.keys(multiValueHeaders).length ? multiValueHeaders : null,
        httpMethod,
        isBase64Encoded: false,
        path,
        pathParameters: Object.keys(req.params).length ? req.params : null,
        queryStringParameters: Object.keys(queryStringParameters).length ? queryStringParameters : null,
        multiValueQueryStringParameters: Object.keys(multiValueQueryStringParameters).length ? multiValueQueryStringParameters : null,
        stageVariables: null,
        requestContext: {
          accountId,
          apiId: apiId,
          authorizer: {}, // TODO: fill when authorizer is supported!
          domainName: req.hostname,
          domainPrefix: req.subdomains.length ? req.subdomains.join('.') : undefined,
          eventType: 'http',
          protocol: req.protocol,
          httpMethod,
          identity: {
            accessKey: null,
            accountId,
            apiKey: null,
            apiKeyId: null,
            caller: null,
            clientCert: null,
            cognitoAuthenticationProvider: null,
            cognitoAuthenticationType: null,
            cognitoIdentityId: null,
            cognitoIdentityPoolId: null,
            principalOrgId: null,
            sourceIp: req.ip,
            user: null,
            userAgent: req.get('user-agent'),
            userArn: null,
          },
          messageId: id,
          path,
          stage: '*',
          requestId: id,
          requestTime: requestTime.toISOString(),
          requestTimeEpoch: requestTime.getTime(),
          resourceId: 'unsupported',
          resourcePath: req.originalUrl,
        },
        resource: req.originalUrl,
      };
      console.log('AWS APIGatewayEvent:', JSON.stringify((req as unknown as Record<string, unknown>).apiGatewayEvent, null, 2));
    }
    next();
  };
}
