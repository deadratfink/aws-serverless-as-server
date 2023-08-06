/**
 * The default maximum body length to print on logging.
 */
export const DEFAULT_LOG_MAX_BODY_LENGTH = 10000;

/**
 * The logger indent size: 4 SPACEs.
 */
export const LOG_INDENT = '    ';

/**
 * The path to swagger UI.
 */
export const PATH_SWAGGER_UI = '/api-docs';

/**
 * The Morgan token for request headers.
 */
export const MORGAN_TOKEN_REQ_HEADERS = 'reqHeaders';

/**
 * The Morgan token for response headers.
 */
export const MORGAN_TOKEN_RES_HEADERS = 'resHeaders';

/**
 * The Morgan token for API Gateway event.
 */
export const MORGAN_TOKEN_API_GATEWAY_EVENT = 'apiGatewayEvent';

/**
 * The Morgan token for API Gateway result.
 */
export const MORGAN_TOKEN_API_GATEWAY_RESULT = 'apiGatewayProxyResult';

/**
 * The Morgan log format string.
 */
export const MORGAN_LOG_FORMAT = `:method :url :status HTTP/:http-version - :response-time ms - :res[content-length] Byte\n\n  REQUEST-HEADERS:\n:${MORGAN_TOKEN_REQ_HEADERS}\n  REQUEST-BODY:\n:${MORGAN_TOKEN_API_GATEWAY_EVENT}\n\n  RESPONSE-HEADERS:\n:${MORGAN_TOKEN_RES_HEADERS}\n  RESPONSE-BODY:\n:${MORGAN_TOKEN_API_GATEWAY_RESULT}`;
