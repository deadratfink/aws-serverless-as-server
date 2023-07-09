import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import compression from 'compression';
import cors from 'cors';
import express, { Express, text } from 'express';
import { IncomingMessage, ServerResponse } from 'http';
import morgan from 'morgan';
import { ignoreFavicon } from './ignore-favicon-middleware';
import { IOptions } from './interfaces';
import { requestToEventMiddleware } from './request-to-event-middleware';
import { resultToResponseMiddleware } from './result-to-response-middleware';
import { createRunHandlerMiddleware } from './run-handler-middleware';
import { indent } from './utils';

/**
 * The default options.
 */
const defaultOptions: IOptions = {
  serverlessOptions: {
    /**
     * Empty API ID.
     */
    apiId: '',
    /**
     * Dummy default.
     */
    awsAccountId: '123456789012',
    /**
     * Region default: `eu-central-1`.
     */
    awsRegion: 'eu-central-1',
    /**
     * The empty Lambda handler information.
     */
    handlerInfos: [],
    // authorizerHandlerInfo: {
    //   authorizerPayloadFormatVersion: '1.0',

    // }
  },
  serverOptions: {
    /**
     * The default port 3000.
     */
    port: 3000,
    /**
     * Do not use compression as default.
     */
    useCompression: false,
    /**
     * Using CORS as default.
     */
    useCors: true,
  },
};

/**
 * TODO.
 *
 * @param options - The options.
 * @returns The Express.js server.
 */
export function runServerlessOnServer(options: IOptions = defaultOptions): Express {
  // TODO merge is not correct for sub objects
  // TODO stage defaults pro function!
  const optionsResult = {
    ...defaultOptions,
    ...options,
  };

  const app = express();

  // TODO: remove
  // app.use(raw({ verify: rawBodySaver, type: '*/*' }));

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
    // TODO: format bei content-type
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
    morgan(
      ':method :url :status HTTP/:http-version - :response-time ms - :res[content-length] Byte\n\n  REQUEST-HEADERS:\n:reqHeaders\n  REQUEST-BODY:\n:apiGatewayEvent\n\n  RESPONSE-HEADERS:\n:resHeaders\n  RESPONSE-BODY:\n:apiGatewayProxyResult',
    ),
  );

  // TODO: implement auth
  // if (optionsResult.serverlessOptions.authorizerHandlerInfo?.authorizerHandler) {
  //   app.use(createRunAuthorizerHandlerMiddleware(optionsResult.serverlessOptions));
  // }

  /* Use as first middleware! */
  app.use(requestToEventMiddleware);

  /* Register your handler execution middlewares. */
  optionsResult.serverlessOptions.handlerInfos.forEach(handlerInfo => {
    app[handlerInfo.method](
      handlerInfo.path.startsWith('/') ? handlerInfo.path : `/${handlerInfo.path}`,
      createRunHandlerMiddleware(handlerInfo.handler),
    );
  });

  /* Use as last middleware! */
  app.use(resultToResponseMiddleware);

  app.listen(optionsResult.serverOptions?.port, () => {
    console.log(`APIGateway simulator (Express.js server) listening on (http://localhost:${optionsResult.serverOptions?.port})`);
  });

  return app;
}
