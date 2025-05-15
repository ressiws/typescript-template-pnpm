import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import JSON5 from "../vendor/json5/index.min.mjs";
import { isFilePath } from "$scripts/util/paths.mjs";

async function readJSON5<T extends object>(filePath: string): Promise<T> {
	if (!isFilePath(filePath))
		throw new Error("File path is not a valid path.");

	if (!path.isAbsolute(filePath))
		throw new Error("File path should be absolute.");

	if (!fs.lstatSync(filePath).isFile())
		throw new Error("File path is not a file.");

	const file = await fsp.readFile(filePath, "utf8");

	return JSON5.parse(file) as T;
}

export {
	readJSON5
};