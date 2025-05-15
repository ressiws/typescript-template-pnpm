/**
 * Gets the caller of the function. Can be offset to allow proxying.
 * 
 * Copyright (c) 2025 DarkenLM https://github.com/darkenlm
 * Copyright (c) 2025 ressiws https://github.com/ressiws
 * 
 * @param {string} parentPath The full path of the parent to be removed from the beginning of the returned line.
 * @param {number} ignoreLevels The number of lines to be poped from the stack trace before processing.
 * @returns {string} The file path and line number of the caller.
 */
function getCallerFilePathAndPosition(parentPath: string, ignoreLevels: number): string {
	const error = new Error();
	const stackLines = (error.stack as string).split("\n").slice(ignoreLevels + 1);

	for (const line of stackLines) {
		const filePositionRegex = /at\s+(.*?)\s+\((.*?):(\d+):\d+\)/;
		const match = filePositionRegex.exec(line);

		if (match && match[1] !== "getCallerFilePathAndPosition") {
			const filePath = match[2];
			const relativeFilePath = filePath.replace(new RegExp(parentPath.replaceAll("\\", "\\\\"), "ig"), "").replace(/^\//, "");
			const position = match[3];

			return `${relativeFilePath}:${position}`.replace(/^[\\/]/, "");
		}
	}

	return "Unknown";
}

export {
	getCallerFilePathAndPosition
};