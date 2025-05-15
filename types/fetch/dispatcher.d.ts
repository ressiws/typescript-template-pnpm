/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Taken from https://github.com/nodejs/undici/tree/23e62c4c0ac992be4fcd5a95151f9edeb76d03cd/types/dispatcher.d.ts
 */

import { URL } from "url";
import { Duplex, Readable, Writable } from "stream";
import { EventEmitter } from "events";
import { Blob } from "buffer";
import { IncomingHttpHeaders } from "./header";
import BodyReadable from "./readable";
import { FormData } from "./formdata";
import Errors from "./errors";

type AbortSignal = unknown;

export default Dispatcher;

/** Dispatcher is the core API used to dispatch requests. */
declare class Dispatcher extends EventEmitter {
	/** Dispatches a request. This API is expected to evolve through semver-major versions and is less stable than the preceding higher level APIs. It is primarily intended for library developers who implement higher level APIs on top of this. */
	private dispatch(options: Dispatcher.DispatchOptions, handler: Dispatcher.DispatchHandlers): boolean;
	/** Starts two-way communications with the requested resource. */
	private connect(options: Dispatcher.ConnectOptions): Promise<Dispatcher.ConnectData>;
	private connect(options: Dispatcher.ConnectOptions, callback: (err: Error | null, data: Dispatcher.ConnectData) => void): void;
	/** Performs an HTTP request. */
	private request(options: Dispatcher.RequestOptions): Promise<Dispatcher.ResponseData>;
	private request(options: Dispatcher.RequestOptions, callback: (err: Error | null, data: Dispatcher.ResponseData) => void): void;
	/** For easy use with `stream.pipeline`. */
	private pipeline(options: Dispatcher.PipelineOptions, handler: Dispatcher.PipelineHandler): Duplex;
	/** A faster version of `Dispatcher.request`. */
	private stream(options: Dispatcher.RequestOptions, factory: Dispatcher.StreamFactory): Promise<Dispatcher.StreamData>;
	private stream(options: Dispatcher.RequestOptions, factory: Dispatcher.StreamFactory, callback: (err: Error | null, data: Dispatcher.StreamData) => void): void;
	/** Upgrade to a different protocol. */
	private upgrade(options: Dispatcher.UpgradeOptions): Promise<Dispatcher.UpgradeData>;
	private upgrade(options: Dispatcher.UpgradeOptions, callback: (err: Error | null, data: Dispatcher.UpgradeData) => void): void;
	/** Closes the client and gracefully waits for enqueued requests to complete before invoking the callback (or returning a promise if no callback is provided). */
	private close(): Promise<void>;
	private close(callback: () => void): void;
	/** Destroy the client abruptly with the given err. All the pending and running requests will be asynchronously aborted and error. Waits until socket is closed before invoking the callback (or returning a promise if no callback is provided). Since this operation is asynchronously dispatched there might still be some progress on dispatched requests. */
	private destroy(): Promise<void>;
	private destroy(err: Error | null): Promise<void>;
	private destroy(callback: () => void): void;
	private destroy(err: Error | null, callback: () => void): void;

	public on(eventName: "connect", callback: (origin: URL, targets: readonly Dispatcher[]) => void): this;
	public on(eventName: "disconnect", callback: (origin: URL, targets: readonly Dispatcher[], error: Errors.UndiciError) => void): this;
	public on(eventName: "connectionError", callback: (origin: URL, targets: readonly Dispatcher[], error: Errors.UndiciError) => void): this;
	public on(eventName: "drain", callback: (origin: URL) => void): this;


	public once(eventName: "connect", callback: (origin: URL, targets: readonly Dispatcher[]) => void): this;
	public once(eventName: "disconnect", callback: (origin: URL, targets: readonly Dispatcher[], error: Errors.UndiciError) => void): this;
	public once(eventName: "connectionError", callback: (origin: URL, targets: readonly Dispatcher[], error: Errors.UndiciError) => void): this;
	public once(eventName: "drain", callback: (origin: URL) => void): this;


	public off(eventName: "connect", callback: (origin: URL, targets: readonly Dispatcher[]) => void): this;
	public off(eventName: "disconnect", callback: (origin: URL, targets: readonly Dispatcher[], error: Errors.UndiciError) => void): this;
	public off(eventName: "connectionError", callback: (origin: URL, targets: readonly Dispatcher[], error: Errors.UndiciError) => void): this;
	public off(eventName: "drain", callback: (origin: URL) => void): this;


	public addListener(eventName: "connect", callback: (origin: URL, targets: readonly Dispatcher[]) => void): this;
	public addListener(eventName: "disconnect", callback: (origin: URL, targets: readonly Dispatcher[], error: Errors.UndiciError) => void): this;
	public addListener(eventName: "connectionError", callback: (origin: URL, targets: readonly Dispatcher[], error: Errors.UndiciError) => void): this;
	public addListener(eventName: "drain", callback: (origin: URL) => void): this;

	public removeListener(eventName: "connect", callback: (origin: URL, targets: readonly Dispatcher[]) => void): this;
	public removeListener(eventName: "disconnect", callback: (origin: URL, targets: readonly Dispatcher[], error: Errors.UndiciError) => void): this;
	public removeListener(eventName: "connectionError", callback: (origin: URL, targets: readonly Dispatcher[], error: Errors.UndiciError) => void): this;
	public removeListener(eventName: "drain", callback: (origin: URL) => void): this;

	public prependListener(eventName: "connect", callback: (origin: URL, targets: readonly Dispatcher[]) => void): this;
	public prependListener(eventName: "disconnect", callback: (origin: URL, targets: readonly Dispatcher[], error: Errors.UndiciError) => void): this;
	public prependListener(eventName: "connectionError", callback: (origin: URL, targets: readonly Dispatcher[], error: Errors.UndiciError) => void): this;
	public prependListener(eventName: "drain", callback: (origin: URL) => void): this;

	public prependOnceListener(eventName: "connect", callback: (origin: URL, targets: readonly Dispatcher[]) => void): this;
	public prependOnceListener(eventName: "disconnect", callback: (origin: URL, targets: readonly Dispatcher[], error: Errors.UndiciError) => void): this;
	public prependOnceListener(eventName: "connectionError", callback: (origin: URL, targets: readonly Dispatcher[], error: Errors.UndiciError) => void): this;
	public prependOnceListener(eventName: "drain", callback: (origin: URL) => void): this;

	public listeners(eventName: "connect"): ((origin: URL, targets: readonly Dispatcher[]) => void)[]
	public listeners(eventName: "disconnect"): ((origin: URL, targets: readonly Dispatcher[], error: Errors.UndiciError) => void)[];
	public listeners(eventName: "connectionError"): ((origin: URL, targets: readonly Dispatcher[], error: Errors.UndiciError) => void)[];
	public listeners(eventName: "drain"): ((origin: URL) => void)[];

	public rawListeners(eventName: "connect"): ((origin: URL, targets: readonly Dispatcher[]) => void)[]
	public rawListeners(eventName: "disconnect"): ((origin: URL, targets: readonly Dispatcher[], error: Errors.UndiciError) => void)[];
	public rawListeners(eventName: "connectionError"): ((origin: URL, targets: readonly Dispatcher[], error: Errors.UndiciError) => void)[];
	public rawListeners(eventName: "drain"): ((origin: URL) => void)[];

	public emit(eventName: "connect", origin: URL, targets: readonly Dispatcher[]): boolean;
	public emit(eventName: "disconnect", origin: URL, targets: readonly Dispatcher[], error: Errors.UndiciError): boolean;
	public emit(eventName: "connectionError", origin: URL, targets: readonly Dispatcher[], error: Errors.UndiciError): boolean;
	public emit(eventName: "drain", origin: URL): boolean;
}

declare namespace Dispatcher {
	export interface DispatchOptions {
		origin?: string | URL;
		path: string;
		method: HttpMethod;
		/** Default: `null` */
		body?: string | Buffer | Uint8Array | Readable | null | FormData;
		/** Default: `null` */
		headers?: IncomingHttpHeaders | string[] | null;
		/** Query string params to be embedded in the request URL. Default: `null` */
		query?: Record<string, any>;
		/** Whether the requests can be safely retried or not. If `false` the request won't be sent until all preceding requests in the pipeline have completed. Default: `true` if `method` is `HEAD` or `GET`. */
		idempotent?: boolean;
		/** Whether the response is expected to take a long time and would end up blocking the pipeline. When this is set to `true` further pipelining will be avoided on the same connection until headers have been received. */
		blocking?: boolean;
		/** Upgrade the request. Should be used to specify the kind of upgrade i.e. `'Websocket'`. Default: `method === 'CONNECT' || null`. */
		upgrade?: boolean | string | null;
		/** The amount of time the parser will wait to receive the complete HTTP headers. Defaults to 300 seconds. */
		headersTimeout?: number | null;
		/** The timeout after which a request will time out, in milliseconds. Monitors time between receiving body data. Use 0 to disable it entirely. Defaults to 300 seconds. */
		bodyTimeout?: number | null;
		/** Whether the request should stablish a keep-alive or not. Default `false` */
		reset?: boolean;
		/** Whether Undici should throw an error upon receiving a 4xx or 5xx response from the server. Defaults to false */
		throwOnError?: boolean;
	}
	export interface ConnectOptions {
		path: string;
		/** Default: `null` */
		headers?: IncomingHttpHeaders | string[] | null;
		/** Default: `null` */
		signal?: AbortSignal | EventEmitter | null;
		/** This argument parameter is passed through to `ConnectData` */
		opaque?: unknown;
		/** Default: 0 */
		maxRedirections?: number;
		/** Default: `null` */
		responseHeader?: "raw" | null;
	}
	export interface RequestOptions extends DispatchOptions {
		/** Default: `null` */
		opaque?: unknown;
		/** Default: `null` */
		signal?: AbortSignal | EventEmitter | null;
		/** Default: 0 */
		maxRedirections?: number;
		/** Default: `null` */
		onInfo?: (info: { statusCode: number, headers: Record<string, string | string[]> }) => void;
		/** Default: `null` */
		responseHeader?: "raw" | null;
		/** Default: `64 KiB` */
		highWaterMark?: number;
	}
	export interface PipelineOptions extends RequestOptions {
		/** `true` if the `handler` will return an object stream. Default: `false` */
		objectMode?: boolean;
	}
	export interface UpgradeOptions {
		path: string;
		/** Default: `'GET'` */
		method?: string;
		/** Default: `null` */
		headers?: IncomingHttpHeaders | string[] | null;
		/** A string of comma separated protocols, in descending preference order. Default: `'Websocket'` */
		protocol?: string;
		/** Default: `null` */
		signal?: AbortSignal | EventEmitter | null;
		/** Default: 0 */
		maxRedirections?: number;
		/** Default: `null` */
		responseHeader?: "raw" | null;
	}
	export interface ConnectData {
		statusCode: number;
		headers: IncomingHttpHeaders;
		socket: Duplex;
		opaque: unknown;
	}
	export interface ResponseData {
		statusCode: number;
		headers: IncomingHttpHeaders;
		body: BodyReadable & BodyMixin;
		trailers: Record<string, string>;
		opaque: unknown;
		context: object;
	}
	export interface PipelineHandlerData {
		statusCode: number;
		headers: IncomingHttpHeaders;
		opaque: unknown;
		body: BodyReadable;
		context: object;
	}
	export interface StreamData {
		opaque: unknown;
		trailers: Record<string, string>;
	}
	export interface UpgradeData {
		headers: IncomingHttpHeaders;
		socket: Duplex;
		opaque: unknown;
	}
	export interface StreamFactoryData {
		statusCode: number;
		headers: IncomingHttpHeaders;
		opaque: unknown;
		context: object;
	}
	export type StreamFactory = (data: StreamFactoryData) => Writable;
	export interface DispatchHandlers {
		/** Invoked before request is dispatched on socket. May be invoked multiple times when a request is retried when the request at the head of the pipeline fails. */
		onConnect?(abort: () => void): void;
		/** Invoked when an error has occurred. */
		onError?(err: Error): void;
		/** Invoked when request is upgraded either due to a `Upgrade` header or `CONNECT` method. */
		onUpgrade?(statusCode: number, headers: Buffer[] | string[] | null, socket: Duplex): void;
		/** Invoked when statusCode and headers have been received. May be invoked multiple times due to 1xx informational headers. */
		onHeaders?(statusCode: number, headers: Buffer[] | string[] | null, resume: () => void): boolean;
		/** Invoked when response payload data is received. */
		onData?(chunk: Buffer): boolean;
		/** Invoked when response payload and trailers have been received and the request has completed. */
		onComplete?(trailers: string[] | null): void;
		/** Invoked when a body chunk is sent to the server. May be invoked multiple times for chunked requests */
		onBodySent?(chunkSize: number, totalBytesSent: number): void;
	}
	export type PipelineHandler = (data: PipelineHandlerData) => Readable;
	export type HttpMethod = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH";

	/**
	 * @link https://fetch.spec.whatwg.org/#body-mixin
	 */
	interface BodyMixin {
		readonly body?: never; // throws on node v16.6.0
		readonly bodyUsed: boolean;
		arrayBuffer(): Promise<ArrayBuffer>;
		blob(): Promise<Blob>;
		formData(): Promise<never>;
		json(): Promise<any>;
		text(): Promise<string>;
	}

	export interface DispatchInterceptor {
		(dispatch: Dispatcher["dispatch"]): Dispatcher["dispatch"]
	}
}