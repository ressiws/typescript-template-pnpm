/**
 * Taken from https://github.com/nodejs/undici/tree/23e62c4c0ac992be4fcd5a95151f9edeb76d03cd/types/header.d.ts
 */

/**
 * The header type declaration of `undici`.
 */
export type IncomingHttpHeaders = Record<string, string | string[] | undefined>;