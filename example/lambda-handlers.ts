import { APIGatewayEvent, APIGatewayProxyResult, Callback, Context } from 'aws-lambda';

/**
 * Async handler example.
 *
 * @param event - The event.
 * @param context - The context.
 * @returns The handler response.
 */
export async function asyncHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
  console.log('CONTEXT:', JSON.stringify(context, null, 2));
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: 'Hello Async World!' }),
  };
}

/**
 * Callback handler example.
 *
 * @param event - The event.
 * @param context - The context.
 * @param callback - The result callback.
 */
export function cbHandler(event: APIGatewayEvent, context: Context, callback: Callback): void {
  console.log('CONTEXT:', JSON.stringify(context, null, 2));
  callback(null, {
    statusCode: 200,
    // headers: {
    //   'Content-Type': 'text/html; charset=utf-8',
    // },
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: 'Hello Callback World!' }),
  });
}

/**
 * POST handler example.
 *
 * @param event - The event.
 * @param context - The context.
 * @returns The handler response.
 */
export async function postHandler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
  console.log('CONTEXT:', JSON.stringify(context, null, 2));
  return {
    statusCode: 201,
    // headers: {
    //   'Content-Type': event.headers['Content-Type'] || event.headers['content-type'] || 'text/plain',
    // },
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event.body ?? {}),
  };
}

// import { EventName } from '@digital-office/de-ves-aws-lambda-logger/enums';
// import { indent } from '@digital-office/de-ves-aws-lambda-logger/utils';
// import { APIGatewayAuthorizerEvent, CustomAuthorizerEvent, CustomAuthorizerResult, PolicyDocument } from 'aws-lambda/trigger/api-gateway-authorizer';
// import { TokenPayload } from 'google-auth-library';
// import { DEFAULT_PRINCIPAL_ID, ENVIRONMENT, GOOGLE_API_CLIENT_ID, ROOT_LOGGER, VALID_DOMAINS } from '../constants';
// import { checkApiToken, TOKEN_PREFIX } from './api-token';
// import { tokenVerify /* , tokenInfo */ } from './google-api';

// /**
//  * The child logger for this file.
//  */
// const logger = ROOT_LOGGER.child(__filename);

// /**
//  * Generates the authentication policy document used in AWS.
//  *
//  * @param effect    - The `Allow/Deny` effect.
//  * @param methodArn - The incoming method ARN.
//  * @returns The policy document.
//  */
// function generatePolicyDocument(effect: string, methodArn: string): AWSLambda.PolicyDocument {
//   logger.debug(`AUTH POLICY for method ARN: ${methodArn}`);
//   // This is due to auth caching issues, see also:
//   // https://forums.aws.amazon.com/thread.jspa?threadID=225934
//   // https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html
//   //                                                   [0]     [1]       <= split '/'
//   // arn:aws:execute-api:eu-central-1:114933185632:4lgtjd4zz9/prod/OPTIONS/organizations/1234
//   //
//   // Allow for all methods ('*') to be cached!
//   const methodArnBase = methodArn.split('/').slice(0, 2).join('/');
//   const resource = `${methodArnBase}/*`;

//   const policyDocument = {
//     Version: '2012-10-17',
//     Statement: [
//       {
//         Action: 'execute-api:Invoke',
//         Effect: effect,
//         Resource: resource,
//       },
//     ],
//   };
//   logger.debug(`AUTH POLICY:\n${indent(JSON.stringify(policyDocument, null, 2))}`);

//   return policyDocument;
// }

// /**
//  * Generates authentication response.
//  *
//  * @param principalId - The principal.
//  * @param effect      - The `Allow/Deny`.
//  * @param methodArn   - The incoming request method ARN.
//  * @returns The authentication response for AWS API Gateway.
//  */
// function generateAuthResponse(principalId: string, effect: string, methodArn: string): CustomAuthorizerResult {
//   const policyDocument: PolicyDocument = generatePolicyDocument(effect, methodArn);
//   const customAuthorizerResult: CustomAuthorizerResult = {
//     principalId,
//     policyDocument,
//   };

//   logger.debug(`CUSTOM AUTH RESULT:\n${indent(JSON.stringify(customAuthorizerResult, null, 2))}`);

//   return customAuthorizerResult;
// }

// /**
//  * Lambda handler for custom token authorization.
//  *
//  * @param event - The AWS Lambda event.
//  * @returns The Lambda `Allow` result.
//  * @throws The `Unauthorized` error.
//  */
// export async function handler(event: APIGatewayAuthorizerEvent): Promise<CustomAuthorizerResult> {
//   const token: string = event.authorizationToken ? event.authorizationToken.replace('Bearer ', '') : '';

//   let payload: TokenPayload | undefined;
//   if (token.startsWith(TOKEN_PREFIX)) {
//     payload = await checkApiToken(token, ENVIRONMENT || '');
//   } else {
//     try {
//       payload = await tokenVerify(token, VALID_DOMAINS, GOOGLE_API_CLIENT_ID as string);
//     } catch (err) {
//       err.message = `Authorization Token invalid: ${err.message}`;
//       logger.error('', err);
//       // TODO: re-activate once you need information about login attempts in GCL!
//       // await GOOGLE_CHAT_LOGGER.error(err);
//       throw new Error('Unauthorized');
//     }
//   }

//   const result = generateAuthResponse(payload && payload.sub ? payload.sub : DEFAULT_PRINCIPAL_ID, 'Allow', event.methodArn);
//   logger.logEventResult(result, EventName.CUSTOM_AUTH);
//   return result;
// }
