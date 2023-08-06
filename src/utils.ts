import { LOG_INDENT, PATH_SWAGGER_UI } from './constants';

/**
 * Indention function. Can handle indention for multi-line string.
 *
 * @param s - The string to indent.
 * @returns The string with indention(s).
 */
export function indent(s: string): string {
  return `${LOG_INDENT}${`${s}`.split(/\r?\n/).join(`\n${LOG_INDENT}`)}`;
}

/**
 * Checks if the incoming request path is associated to Swagger-UI request.
 *
 * @param path - The incoming request path.
 * @returns A `true` if is associated path, else `true`.
 */
export function isSwaggerUiPath(path: string): boolean {
  return path.startsWith(PATH_SWAGGER_UI) || path.includes('swagger-ui') || path.includes('favicon-32x32.png');
}
