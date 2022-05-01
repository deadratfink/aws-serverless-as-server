import { APIGatewayEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import compression from 'compression';
import cors from 'cors';
import express, { Express, text } from 'express';
import { IncomingMessage, ServerResponse } from 'http';
import morgan from 'morgan';
import { expressRequestToAwsApiGatewayEvent } from '../src/from-request-middleware';
import { runServerlessFunc } from '../src/function-middleware';
import { awsApiGatewayProxyResultToExpressResponse } from '../src/to-response-middleware';

export interface IHandlerInfo {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete'; // TODO: more methods!
  path: string;
  handler: Handler<APIGatewayEvent, APIGatewayProxyResult>;
}

export interface IServerRunOptions {
  useCompression?: boolean;
  useCors?: boolean;
  port?: number;
  handlerInfos: IHandlerInfo[];
}

const defaultServerRunOptions: IServerRunOptions = {
  useCompression: false,
  useCors: true,
  port: 3000,
  handlerInfos: [],
};

/**
 * TODO.
 *
 * @param options - The server run options.
 * @returns The Express.js server.
 */
export function runServerlessOnServer(options: IServerRunOptions = defaultServerRunOptions): Express {
  const optionsResult = {
    ...defaultServerRunOptions,
    ...options,
  };

  const app = express();

  // app.use(raw({ verify: rawBodySaver, type: '*/*' }));
  app.use(text({ type: '*/*' }));

  morgan.token('apiGatewayEvent', (req: IncomingMessage /*, res: ServerResponse, args: any */) => {
    const body = ((req as unknown as Record<string, unknown>).apiGatewayEvent as APIGatewayEvent).body;
    // TODO: format bei content-type
    return body
      ? JSON.stringify(((req as unknown as Record<string, unknown>).apiGatewayEvent as APIGatewayProxyResult).body, null, 2)
      : '-';
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  morgan.token('apiGatewayProxyResult', (req: IncomingMessage, res: ServerResponse, args: any) => {
    console.log('ARGS:', args);
    // TODO: format bei content-type
    return JSON.stringify(((res as unknown as Record<string, unknown>).apiGatewayProxyResult as APIGatewayProxyResult).body, null, 2);
  });

  if (optionsResult.useCors) {
    app.use(cors());
  }

  if (optionsResult.useCompression) {
    app.use(compression());
  }

  app.use(
    morgan(
      ':method :url :status :response-time ms - :res[content-length]\nREQUEST-BODY:\n    :apiGatewayEvent\nRESPONSE-BODY:\n    :apiGatewayProxyResult',
    ),
  );

  /* Use as first middleware! */
  app.use(expressRequestToAwsApiGatewayEvent);

  /* Register your handler execution middlewares. */
  optionsResult.handlerInfos.forEach(handlerInfo => {
    app[handlerInfo.method](
      handlerInfo.path.startsWith('/') ? handlerInfo.path : `/${handlerInfo.path}`,
      runServerlessFunc(handlerInfo.handler),
    );
  });

  /* Use as last middleware! */
  app.use(awsApiGatewayProxyResultToExpressResponse);

  app.listen(optionsResult.port, () => {
    console.log(`Example app listening on port ${optionsResult.port} (http://localhost:${optionsResult.port})`);
  });

  return app;
}
