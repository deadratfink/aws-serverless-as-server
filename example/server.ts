// import compression from 'compression';
import { runServerlessOnServer } from '../src/server';
import { asyncHandler, cbHandler, postHandler } from './lambda-handlers';

runServerlessOnServer({
  handlerInfos: [
    {
      method: 'get',
      handler: cbHandler,
      path: '/cb',
    },
    {
      method: 'get',
      handler: asyncHandler,
      path: '/async',
    },
    {
      method: 'post',
      handler: postHandler,
      path: '/post',
    },
  ],
});

// const app = express();
// const port = 3000;

// morgan.token('apiGatewayEvent', (req: IncomingMessage, res: ServerResponse, args: any) => {
//   const body = ((req as unknown as Record<string, unknown>).apiGatewayEvent as APIGatewayEvent).body;
//   // TODO: format bei content-type
//   return body ? JSON.stringify(((req as unknown as Record<string, unknown>).apiGatewayEvent as APIGatewayProxyResult).body, null, 2) : '-';
// });

// morgan.token('apiGatewayProxyResult', (req: IncomingMessage, res: ServerResponse, args: any) => {
//   console.log('ARGS:', args);
//   // TODO: format bei content-type
//   return JSON.stringify(((res as unknown as Record<string, unknown>).apiGatewayProxyResult as APIGatewayProxyResult).body, null, 2);
// });

// app.use(cors());
// app.use(
//   morgan(
//     ':method :url :status :response-time ms - :res[content-length]\nREQUEST-BODY:\n    :apiGatewayEvent\nRESPONSE-BODY:\n    :apiGatewayProxyResult',
//   ),
// );

// app.use(raw({ verify: rawBodySaver, type: '*/*' }));
// app.use(text());

// /* Use as first middleware! */
// app.use(expressRequestToAwsApiGatewayEvent);

// /* Register your handler execution middlewares. */
// app.get('/cb', runServerlessFunc(cbHandler));
// app.get('/async', runServerlessFunc(asyncHandler));
// app.post('/post', runServerlessFunc(postHandler));

// /* Use as last middleware! */
// app.use(awsApiGatewayProxyResultToExpressResponse);

// app.use(compression());

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port} (http://localhost:${port})`);
// });

// export function runServerlessApiHandlerAsServer(options: { port?: number }): Express {
//   const app = express();
//   const port = port ?? 3000;

//   app.use(raw({ verify: rawBodySaver, type: '*/*' }));

//   /* Use as first middleware! */
//   app.use(expressRequestToAwsApiGatewayEvent);

//   /* Register your handler execution middlewares. */
//   app.get('/cb', runServerlessFunc(cbHandler));
//   app.get('/async', runServerlessFunc(asyncHandler));
//   app.post('/post', runServerlessFunc(postHandler));

//   /* Use as last middleware! */
//   app.use(awsApiGatewayProxyResultToExpressResponse);

//   app.listen(port, () => {
//     console.log(`Example app listening on port ${port} (http://localhost:${port})`);
//   });
// }
