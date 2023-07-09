import { runServerlessOnServer } from '../src/server';
import { asyncHandler, cbHandler, postHandler } from './lambda-handlers';

runServerlessOnServer({
  serverlessOptions: {
    apiId: 'example-http-api',
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
  },
});
