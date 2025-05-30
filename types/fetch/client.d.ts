/**
 * Taken from https://github.com/nodejs/undici/tree/23e62c4c0ac992be4fcd5a95151f9edeb76d03cd/types/client.d.ts
 */

import { URL } from "url";
import Dispatcher from "./dispatcher";
import DispatchInterceptor from "./dispatcher";
import buildConnector from "./connector";

/**
 * A basic HTTP/1.1 client, mapped on top a single TCP/TLS connection. Pipelining is disabled by default.
 */
export class Client extends Dispatcher {
	constructor(url: string | URL, options?: Client.Options);
	/** Property to get and set the pipelining factor. */
	private pipelining: number;
	/** `true` after `client.close()` has been called. */
	private closed: boolean;
	/** `true` after `client.destroyed()` has been called or `client.close()` has been called and the client shutdown has completed. */
	private destroyed: boolean;
}

export declare namespace Client {
	export interface OptionsInterceptors {
		Client: readonly DispatchInterceptor[];
	}
	export interface Options {
		/** TODO */
		interceptors?: OptionsInterceptors;
		/** The maximum length of request headers in bytes. Default: `16384` (16KiB). */
		maxHeaderSize?: number;
		/** The amount of time the parser will wait to receive the complete HTTP headers (Node 14 and above only). Default: `300e3` milliseconds (300s). */
		headersTimeout?: number;
		/** @deprecated unsupported socketTimeout, use headersTimeout & bodyTimeout instead */
		socketTimeout?: never;
		/** @deprecated unsupported requestTimeout, use headersTimeout & bodyTimeout instead */
		requestTimeout?: never;
		/** TODO */
		connectTimeout?: number;
		/** The timeout after which a request will time out, in milliseconds. Monitors time between receiving body data. Use `0` to disable it entirely. Default: `300e3` milliseconds (300s). */
		bodyTimeout?: number;
		/** @deprecated unsupported idleTimeout, use keepAliveTimeout instead */
		idleTimeout?: never;
		/** @deprecated unsupported keepAlive, use pipelining=0 instead */
		keepAlive?: never;
		/** the timeout after which a socket without active requests will time out. Monitors time between activity on a connected socket. This value may be overridden by *keep-alive* hints from the server. Default: `4e3` milliseconds (4s). */
		keepAliveTimeout?: number;
		/** @deprecated unsupported maxKeepAliveTimeout, use keepAliveMaxTimeout instead */
		maxKeepAliveTimeout?: never;
		/** the maximum allowed `idleTimeout` when overridden by *keep-alive* hints from the server. Default: `600e3` milliseconds (10min). */
		keepAliveMaxTimeout?: number;
		/** A number subtracted from server *keep-alive* hints when overriding `idleTimeout` to account for timing inaccuracies caused by e.g. transport latency. Default: `1e3` milliseconds (1s). */
		keepAliveTimeoutThreshold?: number;
		/** TODO */
		socketPath?: string;
		/** The amount of concurrent requests to be sent over the single TCP/TLS connection according to [RFC7230](https://tools.ietf.org/html/rfc7230#section-6.3.2). Default: `1`. */
		pipelining?: number;
		/** @deprecated use the connect option instead */
		tls?: never;
		/** If `true`, an error is thrown when the request content-length header doesn't match the length of the request body. Default: `true`. */
		strictContentLength?: boolean;
		/** TODO */
		maxCachedSessions?: number;
		/** TODO */
		maxRedirections?: number;
		/** TODO */
		connect?: buildConnector.BuildOptions | buildConnector.connector;
		/** TODO */
		maxRequestsPerClient?: number;
		/** TODO */
		localAddress?: string;
		/** Max response body size in bytes, -1 is disabled */
		maxResponseSize?: number;
		/** Enables a family autodetection algorithm that loosely implements section 5 of RFC 8305. */
		autoSelectFamily?: boolean;
		/** The amount of time in milliseconds to wait for a connection attempt to finish before trying the next address when using the `autoSelectFamily` option. */
		autoSelectFamilyAttemptTimeout?: number;
	}
	export interface SocketInfo {
		localAddress?: string
		localPort?: number
		remoteAddress?: string
		remotePort?: number
		remoteFamily?: string
		timeout?: number
		bytesWritten?: number
		bytesRead?: number
	}
}

export default Client;