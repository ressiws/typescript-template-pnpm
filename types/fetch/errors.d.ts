/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Taken from https://github.com/nodejs/undici/tree/23e62c4c0ac992be4fcd5a95151f9edeb76d03cd/types/errors.d.ts
 */

import { IncomingHttpHeaders } from "./header";
import Client from "./client";

export default Errors;

declare namespace Errors {
	export class UndiciError extends Error {
		public name: string;
		public code: string;
	}

	/** Connect timeout error. */
	export class ConnectTimeoutError extends UndiciError {
		public name: "ConnectTimeoutError";
		public code: "UND_ERR_CONNECT_TIMEOUT";
	}

	/** A header exceeds the `headersTimeout` option. */
	export class HeadersTimeoutError extends UndiciError {
		public name: "HeadersTimeoutError";
		public code: "UND_ERR_HEADERS_TIMEOUT";
	}

	/** Headers overflow error. */
	export class HeadersOverflowError extends UndiciError {
		public name: "HeadersOverflowError";
		public code: "UND_ERR_HEADERS_OVERFLOW";
	}

	/** A body exceeds the `bodyTimeout` option. */
	export class BodyTimeoutError extends UndiciError {
		public name: "BodyTimeoutError";
		public code: "UND_ERR_BODY_TIMEOUT";
	}

	export class ResponseStatusCodeError extends UndiciError {
		constructor(
			message?: string,
			statusCode?: number,
			headers?: IncomingHttpHeaders | string[] | null,
			body?: null | Record<string, any> | string
		);
		public name: "ResponseStatusCodeError";
		public code: "UND_ERR_RESPONSE_STATUS_CODE";
		public body: null | Record<string, any> | string;
		public status: number;
		public statusCode: number;
		public headers: IncomingHttpHeaders | string[] | null;
	}

	/** Passed an invalid argument. */
	export class InvalidArgumentError extends UndiciError {
		public name: "InvalidArgumentError";
		public code: "UND_ERR_INVALID_ARG";
	}

	/** Returned an invalid value. */
	export class InvalidReturnValueError extends UndiciError {
		public name: "InvalidReturnValueError";
		public code: "UND_ERR_INVALID_RETURN_VALUE";
	}

	/** The request has been aborted by the user. */
	export class RequestAbortedError extends UndiciError {
		public name: "AbortError";
		public code: "UND_ERR_ABORTED";
	}

	/** Expected error with reason. */
	export class InformationalError extends UndiciError {
		public name: "InformationalError";
		public code: "UND_ERR_INFO";
	}

	/** Request body length does not match content-length header. */
	export class RequestContentLengthMismatchError extends UndiciError {
		public name: "RequestContentLengthMismatchError";
		public code: "UND_ERR_REQ_CONTENT_LENGTH_MISMATCH";
	}

	/** Response body length does not match content-length header. */
	export class ResponseContentLengthMismatchError extends UndiciError {
		public name: "ResponseContentLengthMismatchError";
		public code: "UND_ERR_RES_CONTENT_LENGTH_MISMATCH";
	}

	/** Trying to use a destroyed client. */
	export class ClientDestroyedError extends UndiciError {
		public name: "ClientDestroyedError";
		public code: "UND_ERR_DESTROYED";
	}

	/** Trying to use a closed client. */
	export class ClientClosedError extends UndiciError {
		public name: "ClientClosedError";
		public code: "UND_ERR_CLOSED";
	}

	/** There is an error with the socket. */
	export class SocketError extends UndiciError {
		public name: "SocketError";
		public code: "UND_ERR_SOCKET";
		public socket: Client.SocketInfo | null;
	}

	/** Encountered unsupported functionality. */
	export class NotSupportedError extends UndiciError {
		public name: "NotSupportedError";
		public code: "UND_ERR_NOT_SUPPORTED";
	}

	/** No upstream has been added to the BalancedPool. */
	export class BalancedPoolMissingUpstreamError extends UndiciError {
		public name: "MissingUpstreamError";
		public code: "UND_ERR_BPL_MISSING_UPSTREAM";
	}

	export class HTTPParserError extends UndiciError {
		public name: "HTTPParserError";
		public code: string;
	}

	/** The response exceed the length allowed. */
	export class ResponseExceededMaxSizeError extends UndiciError {
		public name: "ResponseExceededMaxSizeError";
		public code: "UND_ERR_RES_EXCEEDED_MAX_SIZE";
	}
}