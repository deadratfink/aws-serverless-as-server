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
      'Content-Type': 'text/html; charset=utf-8',
    },
    body: '<i>Hello Async World!</i>',
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
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
    body: '<i>Hello Callback World!</i>',
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
    headers: {
      'Content-Type': event.headers['Content-Type'] || event.headers['content-type'] || 'text/plain',
    },
    body: event.body ?? '',
  };
}
