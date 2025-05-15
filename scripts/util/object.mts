// pulled this from https://github.com/nodejs/node/issues/34355#issuecomment-658394617
function deepClone<T extends object>(o: T): T {
	if (typeof o !== "object") return o;
	if (!o) return o;

	// https://jsperf.com/deep-copy-vs-json-stringify-json-parse/25
	if (Array.isArray(o)) {
		const newO = [];
		for (let i = 0; i < o.length; i += 1) {
			const val = !o[i] || typeof o[i] !== "object" ? o[i] : deepClone(o[i]);
			newO[i] = val === undefined ? null : val;
		}

		return newO as T;
	}

	const newO: T = {} as T;
	for (const i of Object.keys(o)) {
		const val = !o[i as keyof typeof o]
			|| typeof o[i as keyof typeof o] !== "object"
			? o[i as keyof typeof o]
			: deepClone(o[i as keyof typeof o] as object);

		if (val === undefined) continue;
		newO[i as keyof typeof o] = val as T[keyof T];
	}

	return newO;
}

export {
	deepClone
};