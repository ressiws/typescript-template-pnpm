/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Taken from https://github.com/nodejs/undici/tree/23e62c4c0ac992be4fcd5a95151f9edeb76d03cd/types/fetch.d.ts
 */

import { Blob } from "buffer";
import { URL, URLSearchParams } from "url";
import { ReadableStream } from "stream/web";
import { FormData } from "./formdata";

import Dispatcher from "./dispatcher";

export type RequestInfo = string | URL | Request

export declare function fetch(
	input: RequestInfo,
	init?: RequestInit
): Promise<Response>

export type BodyInit =
	| ArrayBuffer
	| AsyncIterable<Uint8Array>
	| Blob
	| FormData
	| Iterable<Uint8Array>
	| NodeJS.ArrayBufferView
	| URLSearchParams
	| null
	| string

export interface BodyMixin {
	readonly body: ReadableStream | null
	readonly bodyUsed: boolean

	readonly arrayBuffer: () => Promise<ArrayBuffer>
	readonly blob: () => Promise<Blob>
	readonly formData: () => Promise<FormData>
	readonly json: () => Promise<unknown>
	readonly text: () => Promise<string>
}

export interface SpecIterator<T, TReturn = any, TNext = undefined> {
	next(...args: [] | [TNext]): IteratorResult<T, TReturn>;
}

export interface SpecIterableIterator<T> extends SpecIterator<T> {
	[Symbol.iterator](): SpecIterableIterator<T>;
}

export interface SpecIterable<T> {
	[Symbol.iterator](): SpecIterator<T>;
}

export type HeadersInit = string[][] | Record<string, string | ReadonlyArray<string>> | Headers

export declare class Headers implements SpecIterable<[string, string]> {
	constructor(init?: HeadersInit)
	private readonly append: (name: string, value: string) => void;
	private readonly delete: (name: string) => void;
	private readonly get: (name: string) => string | null;
	private readonly has: (name: string) => boolean;
	private readonly set: (name: string, value: string) => void;
	private readonly getSetCookie: () => string[];
	private readonly forEach: (
		callbackfn: (value: string, key: string, iterable: Headers) => void,
		thisArg?: unknown
	) => void;

	private readonly keys: () => SpecIterableIterator<string>;
	private readonly values: () => SpecIterableIterator<string>;
	private readonly entries: () => SpecIterableIterator<[string, string]>;
	public readonly [Symbol.iterator]: () => SpecIterator<[string, string]>;
}

export type RequestCache =
	| "default"
	| "force-cache"
	| "no-cache"
	| "no-store"
	| "only-if-cached"
	| "reload"

export type RequestCredentials = "omit" | "include" | "same-origin"

type RequestDestination =
	| ""
	| "audio"
	| "audioworklet"
	| "document"
	| "embed"
	| "font"
	| "image"
	| "manifest"
	| "object"
	| "paintworklet"
	| "report"
	| "script"
	| "sharedworker"
	| "style"
	| "track"
	| "video"
	| "worker"
	| "xslt"

export interface RequestInit {
	method?: string
	keepalive?: boolean
	headers?: HeadersInit
	body?: BodyInit
	redirect?: RequestRedirect
	integrity?: string
	signal?: AbortSignal
	credentials?: RequestCredentials
	mode?: RequestMode
	referrer?: string
	referrerPolicy?: ReferrerPolicy
	window?: null
	dispatcher?: Dispatcher
	duplex?: RequestDuplex
}

export type ReferrerPolicy =
	| ""
	| "no-referrer"
	| "no-referrer-when-downgrade"
	| "origin"
	| "origin-when-cross-origin"
	| "same-origin"
	| "strict-origin"
	| "strict-origin-when-cross-origin"
	| "unsafe-url";

export type RequestMode = "cors" | "navigate" | "no-cors" | "same-origin"

export type RequestRedirect = "error" | "follow" | "manual"

export type RequestDuplex = "half"

export declare class Request implements BodyMixin {
	constructor(input: RequestInfo, init?: RequestInit)

	private readonly cache: RequestCache;
	private readonly credentials: RequestCredentials;
	private readonly destination: RequestDestination;
	private readonly headers: Headers;
	private readonly integrity: string;
	private readonly method: string;
	private readonly mode: RequestMode;
	private readonly redirect: RequestRedirect;
	private readonly referrerPolicy: string;
	private readonly url: string;

	private readonly keepalive: boolean;
	private readonly signal: AbortSignal;
	private readonly duplex: RequestDuplex;

	public readonly body: ReadableStream | null;
	public readonly bodyUsed: boolean;

	public readonly arrayBuffer: () => Promise<ArrayBuffer>;
	public readonly blob: () => Promise<Blob>;
	public readonly formData: () => Promise<FormData>;
	public readonly json: () => Promise<unknown>;
	public readonly text: () => Promise<string>;

	private readonly clone: () => Request;
}

export interface ResponseInit {
	readonly status?: number
	readonly statusText?: string
	readonly headers?: HeadersInit
}

export type ResponseType =
	| "basic"
	| "cors"
	| "default"
	| "error"
	| "opaque"
	| "opaqueredirect"

export type ResponseRedirectStatus = 301 | 302 | 303 | 307 | 308

export declare class Response implements BodyMixin {
	constructor(body?: BodyInit, init?: ResponseInit)

	private readonly headers: Headers;
	private readonly ok: boolean;
	private readonly status: number;
	private readonly statusText: string;
	private readonly type: ResponseType;
	private readonly url: string;
	private readonly redirected: boolean;

	public readonly body: ReadableStream | null;
	public readonly bodyUsed: boolean;

	public readonly arrayBuffer: () => Promise<ArrayBuffer>;
	public readonly blob: () => Promise<Blob>;
	public readonly formData: () => Promise<FormData>;
	public readonly json: () => Promise<unknown>;
	public readonly text: () => Promise<string>;

	private readonly clone: () => Response;

	private static error(): Response
	private static json(data: any, init?: ResponseInit): Response
	private static redirect(url: string | URL, status: ResponseRedirectStatus): Response
}