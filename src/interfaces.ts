import { APIGatewayAuthorizerHandler, APIGatewayEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';

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
 * The handler information.
 */
export interface IHandlerInfo {
  /**
   * The HTTP method the handler is called for.
   */
  method: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head'; // TODO: more methods?
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
   * The api ID.
   */
  apiId: string;
  /**
   * The authorizer Lambda handler information.
   */
  authorizerHandlerInfo?: IAuthorizerHandlerInfo;
  /**
   * The AWS account ID, dummy default: `123456789012`.
   */
  awsAccountId?: string;
  /**
   * the AWS region, default: `eu-central-1`.
   */
  awsRegion?: string; // TODO: allow only region names
  /**
   * The Lambda handler information.
   */
  handlerInfos: IHandlerInfo[];

  // TODO: Payload format version for all!
  /**
   * The expected [payload format version](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-lambda-authorizer.html#http-api-lambda-authorizer.payload-format),
   * default: 1.0.
   */
  authorizerPayloadFormatVersion?: '1.0' | '2.0';
}

/**
 * The server run options interface.
 */
export interface IServerRunOptions {
  /**
   * The port the server is running on, default: 3000.
   */
  port?: number;
  /**
   * Whether to use response compression if requested, default: `false`.
   */
  useCompression?: boolean;
  /**
   * Whether to use CORS functionality, default: `true`.
   */
  useCors?: boolean;
}

/**
 * The options interface.
 */
export interface IOptions {
  serverlessOptions: IServerlessOptions;
  /**
   * The server run options.
   */
  serverOptions?: IServerRunOptions;
}
