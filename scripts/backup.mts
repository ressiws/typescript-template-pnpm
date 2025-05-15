import fs from "fs";
import path from "path";
import archiver from "archiver";
import { performance } from "perf_hooks";
import isBinMode from "./util/isBinMode.mts";
import { DefaultLogger, getOrCreateGlobalLogger } from "./util/logger.mts";
import { makeLocations } from "./util/paths.mts";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { dirname: __dirname } = makeLocations(import.meta.url);

let logger: DefaultLogger;

function formatDate(date: Date) {
	const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

	const day = date.getDate().toString().padStart(2, "0");
	const month = months[date.getMonth()];
	const year = date.getFullYear().toString().slice(-2);

	return `${year}${month}${day}`;
}

const directoryToZip = path.join(__dirname, "..");
const packageJsonPath = path.join(directoryToZip, "package.json");
const packageJson = require(packageJsonPath);
const packageName = packageJson.name;
const outputDirectory = path.join(directoryToZip, "../backups");

// Files and directories to exclude from the zip
const excludeList = [".git", "node_modules", "pnpm-lock.yaml", "dist", "tsconfig.tsbuildinfo"];

// Check if the output directory exists, if not create it
if (!fs.existsSync(outputDirectory)) {
	fs.mkdirSync(outputDirectory);
}

// Check for existing files in the output directory with the same name
let outputZipFileName = `${packageName}-${formatDate(new Date())}`;
let count = 1;
while (fs.existsSync(path.join(outputDirectory, `${outputZipFileName}.zip`))) {
	outputZipFileName = `${packageName}-${formatDate(new Date())}_${count}`;
	count++;
}
const outputZipFilePath = path.join(outputDirectory, `${outputZipFileName}.zip`);

const archive = archiver("zip", { zlib: { level: 9 }, comment: process.argv.slice(2).join(" ").replaceAll("\\n", "\n") });
const output = fs.createWriteStream(outputZipFilePath);
archive.pipe(output);

// Function to recursively add files and directories to the archive
function addFilesToArchive(dir: string) {
	fs.readdirSync(dir).forEach(file => {
		const filePath = path.join(dir, file);
		if (!excludeList.includes(file) && fs.statSync(filePath).isDirectory()) {
			// If it's a directory and not in exclude list, add its contents
			archive.directory(filePath, file);
			// addFilesToArchive(filePath);
		} else if (!excludeList.includes(file) && fs.statSync(filePath).isFile()) {
			// If it's a file and not in exclude list, add it
			archive.file(filePath, { name: file });
		}
	});
}

async function cliHandler() {
	logger = getOrCreateGlobalLogger();

	logger.info("Starting backup...");
	const startTime = performance.now();

	addFilesToArchive(directoryToZip);

	await archive.finalize();
	const endTime = performance.now();

	logger.pSuccess(`BACKUP FINISHED IN \x1b[1;31m[${new Date(endTime - startTime).toISOString().slice(11, 19)}]\x1b[0m`);
	logger.pInfo(`Backup file: '${outputZipFilePath}'`);
}

if (isBinMode(import.meta.url)) {
	await cliHandler();
}
