import path from "path";
import fs from "fs";
import fsp from "fs/promises";
import { fileURLToPath } from "url";

/**
 * Checks if the given path is a valid file path.
 * @param filePath 
 * @returns 
 */
const isFilePath = (filePath: string) => !!filePath.match(/^(?:[a-z]:)?[/\\]{0,2}(?:[./\\ ](?![./\\\n])|[^<>:"|?*./\\ \n])+$/i);

/**
 * Checks if the given paths are equal.
 * @param path1 
 * @param path2 
 */
function arePathsEqual(path1: string, path2: string): boolean {
	return path.resolve(path1) === path.resolve(path2);
}

/**
 * Checks if the given leaf path is a child of the given root path.
 * @param root The root path.
 * @param leaf The leaf path.
 */
function isPathLeaf(root: string, leaf: string): boolean {
	return path.resolve(leaf).includes(path.resolve(root));
}

function makeLocations(importMetaUrl: string) {
	const _filename = fileURLToPath(importMetaUrl);
	const _dirname = path.dirname(_filename);

	return { filename: _filename, dirname: _dirname };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function readJsonFile<T extends Record<string, any>>(filePath: string): Promise<T> {
	// if (!isFilePath(filePath)) throw new Error("File path is not a valid path.");
	if (!path.isAbsolute(filePath)) throw new Error("File path should be absolute.");
	if (!fs.lstatSync(filePath).isFile()) throw new Error("File path is not a file.");
	// if (path.extname(filePath).replace(".", "") !== "json") throw new Error("File path is not a JSON file.");

	const file = await fsp.readFile(filePath, "utf8");
	return JSON.parse(file);
}

/**
 * Reads a directory recursively.
 * @param dir The directory to read.
 * @returns A list of all file paths in the given directory.
 */
async function readRecursiveDirectory(dir: string) {
	const files = await fsp.readdir(dir, { withFileTypes: true });
	const result: string[] = [];

	for (const file of files) {
		const filePath = path.join(dir, file.name);
		if (file.isDirectory()) {
			result.push(...await readRecursiveDirectory(filePath));
		} else {
			result.push(filePath);
		}
	}

	return result;
}

function pathToPOSIX(filePath: string) {
	return filePath.split(path.win32.sep).join(path.posix.sep);
}

export {
	isFilePath, arePathsEqual, isPathLeaf,
	makeLocations,
	readJsonFile, readRecursiveDirectory,
	pathToPOSIX
};