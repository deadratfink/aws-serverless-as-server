import { license, version } from '../package.json';
import { runServerlessOnServer } from '../src/server';
import { asyncHandler, cbHandler, postHandler } from './lambda-handlers';

runServerlessOnServer({
  openApi: {
    openapi: '3.1.0',
    info: {
      title: 'http-api-example',
      version,
      license: {
        name: license,
      },
    },
    // servers: [
    //   {
    //     url: 'http://localhost:3000',
    //   },
    // ],
    paths: {
      '/cb': {
        get: {
          summary: 'Get a Lambda route with callback',
          operationId: 'getLambdaRouteWithCallback',
          tags: ['cb'],
          // parameters: [
          //   {
          //     name: 'limit',
          //     in: 'query',
          //     description: 'How many items to return at one time (max 100)',
          //     required: false,
          //     schema: {
          //       type: 'integer',
          //       format: 'int32',
          //     },
          //   },
          // ],
          responses: {
            '200': {
              description: 'A string response',
              // headers: {
              //   'x-next': {
              //     description: 'A link to the next page of responses',
              //     schema: {
              //       type: 'string',
              //     },
              //   },
              // },
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Message',
                  },
                },
              },
            },
            default: {
              description: 'unexpected error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Message: {
          type: 'object',
          required: ['message'],
          properties: {
            // id: {
            //   type: 'integer',
            //   format: 'int64',
            // },
            message: {
              type: 'string',
            },
            // tag: {
            //   type: 'string',
            // },
          },
        },
        // Pets: {
        //   type: 'array',
        //   items: {
        //     $ref: '#/components/schemas/Pet',
        //   },
        // },
        Error: {
          type: 'object',
          required: ['code', 'message'],
          properties: {
            code: {
              type: 'integer',
              format: 'int32',
            },
            message: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  serverlessOptions: {
    apiId: 'http-api-example',
    handlerOptions: [
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
