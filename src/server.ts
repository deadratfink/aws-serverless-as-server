import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import compression from 'compression';
import cors from 'cors';
import express, { Express, Request, text } from 'express';
import { IncomingMessage, ServerResponse } from 'http';
import morgan from 'morgan';
import { serve, setup } from 'swagger-ui-express';
import { MORGAN_LOG_FORMAT, PATH_SWAGGER_UI } from './constants';
import { ignoreFavicon } from './ignore-favicon-middleware';
import { IHandlerOptions, IOptions } from './interfaces';
import { createRequestToEventMiddleware } from './request-to-event-middleware';
import { resultToResponseMiddleware } from './result-to-response-middleware';
import { createRunHandlerMiddleware } from './run-handler-middleware';
import { indent, isSwaggerUiPath } from './utils';

/**
 * Runs the APIGateway simulator (Swagger UI/Express.js server) with the given configuration.
 *
 * @param options - The run options.
 * @returns The Express.js server.
 */
export function runServerlessOnServer(options: IOptions): Express {
  // TODO stage defaults pro function!
  const optionsResult = {
    openApi: options.openApi,
    serverlessOptions: {
      apiId: options.serverlessOptions.apiId ?? options.openApi.info.title,
      awsAccountId: options.serverlessOptions.awsAccountId ?? '123456789012',
      awsRegion: options.serverlessOptions.awsRegion ?? 'eu-central-1',
      handlerOptions: options.serverlessOptions.handlerOptions ?? [],
      // authorizerHandlerInfo: {
      //   authorizerPayloadFormatVersion: '1.0',
      // }
    },
    serverOptions: {
      port: options.serverOptions?.port ?? 3000,
      useCompression: options.serverOptions?.useCompression ?? true,
      useCors: options.serverOptions?.useCors ?? 3000,
    },
  };

  console.log('optionsResult >>>>>>', JSON.stringify(optionsResult, null, 2));

  const app = express();

  /* Handle favicon requests with HTTP 204. */
  app.use(ignoreFavicon);

  /* Turn body to string for every mimetype. */
  app.use(text({ type: '*/*' }));

  morgan.token('reqHeaders', (req: IncomingMessage /*, res: ServerResponse, args: any */) => {
    return indent(JSON.stringify(req.headers, null, 2));
  });

  morgan.token('resHeaders', (req: IncomingMessage, res: ServerResponse /* , args: any */) => {
    return indent(JSON.stringify(res.getHeaders(), null, 2));
  });

  morgan.token('apiGatewayEvent', (req: IncomingMessage /*, res: ServerResponse, args: any */) => {
    const body = ((req as unknown as Record<string, unknown>).apiGatewayEvent as APIGatewayEvent).body;
    // TODO: format bei anderem content-type
    return body
      ? indent(JSON.stringify(((req as unknown as Record<string, unknown>).apiGatewayEvent as APIGatewayProxyResult).body, null, 2))
      : indent('-');
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  morgan.token('apiGatewayProxyResult', (req: IncomingMessage, res: ServerResponse, args: any) => {
    console.log('ARGS:', args);
    // TODO: format bei content-type
    return indent(
      JSON.stringify(((res as unknown as Record<string, unknown>).apiGatewayProxyResult as APIGatewayProxyResult)?.body, null, 2),
    );
  });

  if (optionsResult.serverOptions?.useCors) {
    app.use(cors());
  }

  if (optionsResult.serverOptions?.useCompression) {
    app.use(compression());
  }

  app.use(
    morgan(MORGAN_LOG_FORMAT, {
      skip: (req: Request) => {
        return isSwaggerUiPath(req.path);
      },
    }),
  );

  // TODO: auth handler
  // if (optionsResult.serverlessOptions.authorizerHandlerInfo?.authorizerHandler) {
  //   app.use(createRunAuthorizerHandlerMiddleware(optionsResult.serverlessOptions));
  // }

  /* Swagger UI. */
  app.use(PATH_SWAGGER_UI, serve);
  app.get(PATH_SWAGGER_UI, setup(options.openApi));

  /* Use as first route middleware! */
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  app.use(createRequestToEventMiddleware(optionsResult.serverlessOptions.apiId, optionsResult.serverlessOptions.awsAccountId!));

  const routesInfo: string[] = [];
  /* Register your handler execution route middlewares. */
  optionsResult.serverlessOptions.handlerOptions.forEach((handlerOptions: IHandlerOptions) => {
    // TODO: map path params notation to Express specific: {id} => :id
    app[handlerOptions.method](
      handlerOptions.path.startsWith('/') ? handlerOptions.path : `/${handlerOptions.path}`,
      createRunHandlerMiddleware(handlerOptions.handler),
    );
    routesInfo.push(
      `http://localhost:${optionsResult.serverOptions?.port}${
        handlerOptions.path.startsWith('/') ? handlerOptions.path : `/${handlerOptions.path}`
      }`,
    );
  });

  /* Use as last route middleware! */
  app.use(resultToResponseMiddleware);

  // TODO: show Swagger only if openapi is set properly!
  app.listen(optionsResult.serverOptions?.port, () => {
    console.log(
      `APIGateway simulator (Swagger UI/Express.js server) listening as follows on:\n  - http://localhost:${
        optionsResult.serverOptions?.port
      }${PATH_SWAGGER_UI}\nor alternatively, the routes:\n  - ${routesInfo.join('\n  - ')}`,
    );
  });

  return app;
}
