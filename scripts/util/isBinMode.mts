import path from "path";
import { fileURLToPath } from "url";

export default function isBinMode(importMetaUrl = import.meta.url) {
	const pathToThisFile = path.resolve(fileURLToPath(importMetaUrl));
	const pathPassedToNode = path.resolve(process.argv[1]);

	return pathToThisFile.includes(pathPassedToNode);
}