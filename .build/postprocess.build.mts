/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @file postprocess.mts
 * @description This module is used to postprocess the build output, replacing mocks with the actual implementation.
 * @version 1.0.0
 * 
 * Copyright (c) 2025 DarkenLM https://github.com/darkenlm
 * Copyright (c) 2025 ressiws https://github.com/ressiws
 */

import path from "path";
import fsp from "fs/promises";
import { cac } from "cac";
import ts from "typescript";
import isBinMode from "$scripts/util/isBinMode.mts";
import { DefaultLogger, getOrCreateGlobalLogger } from "$scripts/util/logger.mts";
import { makeLocations, readJsonFile, readRecursiveDirectory } from "$scripts/util/paths.mts";
import { readJSON5 } from "./util/readJSON5.mts";

let logger: DefaultLogger;
const { dirname: __dirname, filename: __filename } = makeLocations(import.meta.url);

//#region ============== Types ==============
type PPPathOperation = "REMOVE" | "REPLACE";

interface PPPath {
	op: PPPathOperation,
	target?: string
}

type CompilerOptions = typeof ts.parseCommandLine extends (...args: any[]) => infer TResult ?
	TResult extends { options: infer TOptions } ? TOptions : never : never;
type TypeAcquisition = typeof ts.parseCommandLine extends (...args: any[]) => infer TResult ?
	TResult extends { typeAcquisition?: infer TTypeAcquisition } ? TTypeAcquisition : never : never;

interface TsConfig {
	compilerOptions: CompilerOptions;
	exclude: string[];
	compileOnSave: boolean;
	extends: string;
	files: string[];
	include: string[];
	typeAcquisition: TypeAcquisition
}

interface PPTSConfig extends TsConfig {
	postprocess: {
		paths: Record<string, PPPath>
	}
}

interface PPRegexes {
	anonymousImportRegex: RegExp,
	anonymousDynamicImportRegex: RegExp,
	targetedImportRegex: RegExp,
	incompleteImportRegex: RegExp
}

interface CLIOptions {
	debug: boolean,
	ext: string[]
}
//#endregion

//#region ============== Constants ==============
const NAME = "script";
const VERSION = "1.2.1";
const DEFAULT_EXTENSIONS = [".js", ".map"];
const DEFAULT_ROOT = (tsconfig: TsConfig) => path.resolve(
	__dirname,
	"..",
	tsconfig.compilerOptions.outDir
);
const SOURCE_EXTENSIONS = [".js"];
const SOURCEMAP_EXTENSIONS = [".map"];
//#endregion

//#region ============== Functions ==============
function isSourceFile(filePath: string): boolean {
	return SOURCE_EXTENSIONS.includes(path.extname(filePath));
}

function isSourceMapFile(filePath: string): boolean {
	return SOURCEMAP_EXTENSIONS.includes(path.extname(filePath));
}
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
isSourceMapFile;

function makeRelativePath(root: string, filepath: string, target: string) {
	return path.join(path.relative(path.dirname(filepath), root), target) + path.sep;
}

async function postprocessSource(root: string, filePath: string, tsconfig: PPTSConfig, regexes: PPRegexes): Promise<boolean> {
	logger.info(`Postprocessing file at ${filePath}.`);

	const fileData = await fsp.readFile(filePath, { encoding: "utf8" });
	let newFileData = fileData;

	let arr: RegExpExecArray, replaced = false;
	while ((arr = regexes.anonymousImportRegex.exec(fileData)) !== null) {
		const ppOp = tsconfig.postprocess.paths[`${arr[2]}/*`];
		if (!ppOp) {
			logger.warn(`Skipping import '${arr[0]}' at ${arr.index}: unknown import alias.`);
			continue;
		}

		if (ppOp.op === "REMOVE") {
			newFileData = newFileData.replace(arr[0], "");
			replaced = true;
		} else if (ppOp.op === "REPLACE") {
			newFileData = newFileData.replace(
				arr[0],
				`import${arr[1]}`
				+ `"${makeRelativePath(root, filePath, ppOp.target || (tsconfig.compilerOptions.paths[`${arr[2]}/*`] || [])[0])}${arr[3]}"`
				+ `${arr[4]}`
			);
			replaced = true;
		}
	}

	while ((arr = regexes.anonymousDynamicImportRegex.exec(fileData)) !== null) {
		const ppOp = tsconfig.postprocess.paths[`${arr[2]}/*`];
		if (!ppOp) {
			logger.warn(`Skipping import '${arr[0]}' at ${arr.index}: unknown import alias.`);
			continue;
		}

		if (ppOp.op === "REMOVE") {
			newFileData = newFileData.replace(arr[0], "");
			replaced = true;
		} else if (ppOp.op === "REPLACE") {
			newFileData = newFileData.replace(
				arr[0],
				`import${arr[1]}(`
				+ `"${makeRelativePath(root, filePath, ppOp.target || (tsconfig.compilerOptions.paths[`${arr[2]}/*`] || [])[0])}${arr[3].replace(/^\//, "")}"`
				+ `)${arr[4]}`
			);
			replaced = true;
		}
	}

	while ((arr = regexes.targetedImportRegex.exec(fileData)) !== null) {
		const ppOp = tsconfig.postprocess.paths[`${arr[3]}/*`];
		if (!ppOp) {
			logger.warn(`Skipping import '${arr[0]}' at ${arr.index}: unknown import alias.`);
			continue;
		}

		if (ppOp.op === "REMOVE") {
			newFileData = newFileData.replace(arr[0], "");
			replaced = true;
		} else if (ppOp.op === "REPLACE") {
			newFileData = newFileData.replace(
				arr[0],
				`import${arr[1]}from${arr[2]}`
				+ `"${makeRelativePath(root, filePath, ppOp.target || (tsconfig.compilerOptions.paths[`${arr[3]}/*`] || [])[0])}${arr[4].replace(/^\//, "")}"`
				+ `${arr[5]}`
			);
			replaced = true;
		}
	}

	while ((arr = regexes.incompleteImportRegex.exec(newFileData)) !== null) {
		newFileData = newFileData.replace(arr[0], `${arr[1]}${arr[2]}.js${arr[3]}`);
		replaced = true;
	}

	if (replaced) {
		await fsp.writeFile(filePath, newFileData, { encoding: "utf8" });

		logger.success(`Successfully postprocessed file at ${filePath}.`);
	} else {
		logger.warn(`No replacements were made for file at ${filePath}.`);
	}

	return replaced;
}

async function script(options: CLIOptions) {
	logger.log("Running script with options", options);

	logger.info("Reading tsconfig.json...");
	const tsconfig = await readJSON5<PPTSConfig>(path.join(__dirname, "../tsconfig.json"));
	logger.success("Successfully read tsconfig.json.");

	logger.log("TSConfig:", tsconfig);

	const root = DEFAULT_ROOT(tsconfig);
	logger.log("Root:", root);

	const anonymousImportRegex = new RegExp(
		`import(\\s+)[\"'](${Object.keys(tsconfig.compilerOptions.paths).map(p => `(?:${p.replace("/*", "").replaceAll("$", "\\$")})`).join("|")})([^\"']+)[\"'](;?)`,
		"gm"
	);

	const anonymousDynamicImportRegex = new RegExp(
		`import(\\s*)\\([\"'](${Object.keys(tsconfig.compilerOptions.paths).map(p => `(?:${p.replace("/*", "").replaceAll("$", "\\$")})`).join("|")})([^\"']+)[\"']\\)(;?)`,
		"gm"
	);
	const targetedImportRegex = new RegExp(
		`import(.+)from(\\s+)[\"'](${Object.keys(tsconfig.compilerOptions.paths).map(p => `(?:${p.replace("/*", "").replaceAll("$", "\\$")})`).join("|")})([^\"']+)[\"'](;?)`,
		"gm"
	);
	const incompleteImportRegex = /(import(?:[^"']+)["'])(\..*(?<!.js))(["'].+)/gm;

	const regexes = { anonymousImportRegex, anonymousDynamicImportRegex, targetedImportRegex, incompleteImportRegex };
	logger.log("REGEXES:", regexes);

	logger.info("Reading build directory...");
	const files = await readRecursiveDirectory(path.resolve(path.join(__dirname, "..", tsconfig.compilerOptions.outDir)));
	logger.success(`Successfully read ${files.length} files.`);

	let ignored = 0;
	for (const file of files) {
		logger.log("\n");
		logger.info(`Attempting to postprocess file '${file}'...`);

		if (!options.ext.includes(path.extname(file))) {
			logger.warn(`Skipping file '${file}': unsupported.`);
			ignored++;
			continue;
		}

		let processed = false;
		if (isSourceFile(file)) processed = await postprocessSource(root, file, tsconfig, regexes);

		if (!processed) ignored++;
	}

	logger.pSuccess(`Successfully postprocessed ${files.length - ignored} files (${ignored} ignored).`);
}
//#endregion

//#region ============== CLI ==============
const cli = cac(NAME).version(VERSION);
cli.help();
cli.option("--debug, -d", "Enable debug mode");
cli.option("--ext <extensions...>", "Specify the file extensions to postprocess", { default: DEFAULT_EXTENSIONS, type: [String] });

async function cliHandler() {
	const { options } = cli.parse();
	if (options.help || options.version) return; // Do not execute script if help message was requested.

	logger = getOrCreateGlobalLogger({ debug: options.debug });

	await script(options as CLIOptions);
}

if (isBinMode(import.meta.url)) {
	cliHandler();
}
//#endregion