import { APIGatewayAuthorizerHandler, APIGatewayEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
// import { OpenAPIObject } from 'openapi3-ts/oas31';
import { JsonObject } from 'swagger-ui-express';

/**
 * The authorizer handler information.
 */
export interface IAuthorizerHandlerInfo {
  /**
   * The authorizer handler type. Support for:
   * - `TOKEN`
   * - `REQUEST`.
   *
   * Default: `TOKEN`.
   */
  authorizerEventPayload?: {
    /**
     * The `TOKEN` authorizer type.
     */
    token?: {
      /**
       * Name of a header for token source, default: `Authorization`.
       */
      header?: string;
      /**
       * Token validation RegEx, default `Bearer.*`
       */
      validationRegEx?: string;
      // TODO: cache?
    };
  };
  /**
   * The authorizer handler to execute.
   */
  authorizerHandler?: APIGatewayAuthorizerHandler;
}

/**
 * The handler options.
 */
export interface IHandlerOptions {
  /**
   * The HTTP method the handler is called for.
   */
  method: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' | 'trace';
  /**
   * The path of the handler.
   */
  path: string;
  /**
   * The handler to execute.
   */
  handler: Handler<APIGatewayEvent, APIGatewayProxyResult>;
  /**
   * The stage, default: `prod`.
   */
  stage?: string;
  // TODO: gibt es type dafür?
  stageVariables?: Record<string, unknown>;
}

/**
 * The serverless run options interface.
 */
export interface IServerlessOptions {
  /**
   * The API ID.
   */
  apiId?: string;
  // TODO: authorizer support
  // /**
  //  * The authorizer Lambda handler information.
  //  */
  // authorizerHandlerInfo?: IAuthorizerHandlerInfo;
  /**
   * The AWS account ID.
   *
   * @default `123456789012`.
   */
  awsAccountId?: string;
  /**
   * the AWS region.
   *
   * @default `eu-central-1`.
   */
  awsRegion?: string; // TODO: allow only region names
  /**
   * The Lambda handler information.
   */
  handlerOptions: IHandlerOptions[];
  // TODO: Payload format for all versions!
  /**
   * The expected [payload format version](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-lambda-authorizer.html#http-api-lambda-authorizer.payload-format),
   *
   * @default 1.0.
   */
  authorizerPayloadFormatVersion?: '1.0' | '2.0';
}

/**
 * The server run options interface.
 */
export interface IServerOptions {
  /**
   * The port the server is running on.
   *
   * @default 3000
   */
  port?: number;
  /**
   * Whether to use response compression if requested.
   *
   * @default `false`.
   */
  useCompression?: boolean;
  /**
   * Whether to use CORS functionality.
   *
   * @default `true`.
   */
  useCors?: boolean;
}

/**
 * The options interface.
 */
export interface IOptions {
  /**
   * The Open API spec.
   */
  openApi: JsonObject;
  /**
   * The serverless options.
   */
  serverlessOptions: IServerlessOptions;
  /**
   * The server run options.
   */
  serverOptions?: IServerOptions;
}
