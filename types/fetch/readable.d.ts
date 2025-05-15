/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Taken from https://github.com/nodejs/undici/tree/23e62c4c0ac992be4fcd5a95151f9edeb76d03cd/types/readable.d.ts
 */

import { Readable } from "stream";
import { Blob } from "buffer";

export default BodyReadable;

declare class BodyReadable extends Readable {
	constructor(
		resume?: (this: Readable, size: number) => void | null,
		abort?: () => void | null,
		contentType?: string
	)

	/** Consumes and returns the body as a string
	 *  https://fetch.spec.whatwg.org/#dom-body-text
	 */
	private text(): Promise<string>

	/** Consumes and returns the body as a JavaScript Object
	 *  https://fetch.spec.whatwg.org/#dom-body-json
	 */
	private json(): Promise<any>

	/** Consumes and returns the body as a Blob
	 *  https://fetch.spec.whatwg.org/#dom-body-blob
	 */
	private blob(): Promise<Blob>

	/** Consumes and returns the body as an ArrayBuffer
	 *  https://fetch.spec.whatwg.org/#dom-body-arraybuffer
	 */
	private arrayBuffer(): Promise<ArrayBuffer>

	/** Not implemented
	 *
	 *  https://fetch.spec.whatwg.org/#dom-body-formdata
	 */
	private formData(): Promise<never>

	/** Returns true if the body is not null and the body has been consumed
	 *
	 *  Otherwise, returns false
	 *
	 * https://fetch.spec.whatwg.org/#dom-body-bodyused
	 */
	private readonly bodyUsed: boolean;

	/** Throws on node 16.6.0
	 *
	 *  If body is null, it should return null as the body
	 *
	 *  If body is not null, should return the body as a ReadableStream
	 *
	 *  https://fetch.spec.whatwg.org/#dom-body-body
	 */
	private readonly body: never | undefined;

	/** Dumps the response body by reading `limit` number of bytes.
	 * @param opts.limit Number of bytes to read (optional) - Default: 262144
	 */
	private dump(opts?: { limit: number }): Promise<void>
}