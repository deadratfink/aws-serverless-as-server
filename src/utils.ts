import { LOG_INDENT } from './constants';

/**
 * Indention function. Can handle indention for multi-line string.
 *
 * @param s - The string to indent.
 * @returns The string with indention(s).
 */
export function indent(s: string): string {
  return `${LOG_INDENT}${`${s}`.split(/\r?\n/).join(`\n${LOG_INDENT}`)}`;
}
