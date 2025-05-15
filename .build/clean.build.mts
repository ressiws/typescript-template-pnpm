/**
 * @file script.mts
 * @description The template to be used for all scripts in the project.
 * @version 1.0.0
 * 
 * Copyright (c) 2025 DarkenLM https://github.com/darkenlm
 * Copyright (c) 2025 ressiws https://github.com/ressiws
 */

import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { cac } from "cac";
import dotenv from "dotenv";
import isBinMode from "$scripts/util/isBinMode.mts";
import { DefaultLogger, getOrCreateGlobalLogger } from "$scripts/util/logger.mts";
import { isPathLeaf, makeLocations } from "$scripts/util/paths.mts";
import { generateRandomPhrase } from "$scripts/util/rand.mts";
import { confirmDangerousOperationPassphrase } from "$scripts/util/dangerZone.mts";
import chalk from "chalk";

let logger: DefaultLogger;
const { dirname: __dirname, filename: __filename } = makeLocations(import.meta.url);
dotenv.config();

//#region ============== Types ==============
interface CLIOptions {
	debug: boolean,
	force: boolean,
	target: string[]
}
//#endregion

//#region ============== Constants ==============
const NAME = "clean.build";
const VERSION = "1.0.0";
const DEFAULT_ROOT = path.join(__dirname, "../");
const DEFAULT_TARGETS = ["dist", "tsconfig.tsbuildinfo"];
const PROTECTED_TARGETS = [
	path.join(__dirname, "../.vscode"),
	path.join(__dirname, "../.build"),
	path.join(__dirname, "../types"),
	path.join(__dirname, "../scripts"),
	path.join(__dirname, "../src"),
	path.join(__dirname, "../.env"),
	path.join(__dirname, "../.gitignore"),
	path.join(__dirname, "../.npmrc"),
	path.join(__dirname, "../.eslintrc"),
	path.join(__dirname, "../tsconfig.json"),
	path.join(__dirname, "../eslint.config.mjs"),
	path.join(__dirname, "../package.json"),
	path.join(__dirname, "../README.md"),
	path.join(__dirname, "../LICENSE.md"),
];
//#endregion

//#region ============== Functions ==============
async function clean(targets: string[], root: string = DEFAULT_ROOT, force: boolean = false) {
	logger.pInfo(`Cleaning ${targets.length} targets.`);

	let ignored = 0;
	for (const target of targets) {
		const targetPath = path.resolve(root, target);

		if (!force && PROTECTED_TARGETS.some(p => isPathLeaf(p, targetPath))) {
			logger.pWarn(`Cannot clean protected target: ${targetPath}`);
			ignored++;
			continue;
		}

		if (!fs.existsSync(targetPath)) {
			logger.pWarn(`Target does not exist: '${targetPath}'. Skipping.`);
			ignored++;
			continue;
		}

		logger.info(`Cleaning target: ${targetPath}`);
		await fsp.rm(targetPath, { recursive: true, force: true });
		logger.success(`Successfully cleaned target: ${targetPath}`);
	}

	logger.pSuccess(`Successfully cleaned ${targets.length - ignored} targets (${ignored} ignored).`);
}

async function script(options: CLIOptions) {
	logger.log("Running script with options", options);

	let targets: string[] = [];
	if (options.target)
		targets = options.target;
	else
		targets = DEFAULT_TARGETS;

	if (options.force) {
		const passphrase = generateRandomPhrase();
		logger.log("PASSPHRASE:", passphrase);

		await confirmDangerousOperationPassphrase((_, passphrase) => {
			return chalk.bgRed.white(`WARNING: Force mode is enabled. This will delete all targets without confirmation. To proceed, type '${passphrase}' to confirm:`) + " ";
		}, passphrase, true);
	}

	await clean(targets, DEFAULT_ROOT, options.force);
}
//#endregion

//#region ============== CLI ==============
const cli = cac(NAME).version(VERSION);
cli.help();
cli.option("--debug, -d", "Enable debug mode");
cli.option("--force, -f", "Force the script to run");
cli.option("--root <root>", "The root directory to use", { default: DEFAULT_ROOT, type: String as never });
cli.option("--target, -t <target>", "The targets to clean", { default: DEFAULT_TARGETS, type: [String] });

async function cliHandler() {
	const { options } = cli.parse();
	if (options.help || options.version)
		return; // Do not execute script if help message was requested.

	logger = getOrCreateGlobalLogger({ debug: options.debug });

	await script(options as CLIOptions);
}

if (isBinMode(import.meta.url)) {
	cliHandler();
}
//#endregion

export {
	clean
};