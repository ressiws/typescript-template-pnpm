/**
 * @file script.mts
 * @description The template to be used for all scripts in the project.
 * @version 1.0.0
 * 
 * Copyright (c) 2025 DarkenLM https://github.com/darkenlm
 * Copyright (c) 2025 ressiws https://github.com/ressiws
 */

import { cac } from "cac";
import dotenv from "dotenv";
import isBinMode from "../util/isBinMode.mts";
import { DefaultLogger, getOrCreateGlobalLogger } from "../util/logger.mts";
import { makeLocations } from "../util/paths.mts";

let logger: DefaultLogger;
const { dirname: __dirname, filename: __filename } = makeLocations(import.meta.url);
dotenv.config();

//#region ============== Types ==============
interface CLIOptions {
	debug: boolean
}
//#endregion

//#region ============== Constants ==============
const NAME = "script";
const VERSION = "1.0.0";
//#endregion

//#region ============== Functions ==============
async function script(options: CLIOptions) {
	logger.pLog("Running script with options", options);
}
//#endregion

//#region ============== CLI ==============
const cli = cac(NAME).version(VERSION);
cli.help();
cli.option("--debug, -d", "Enable debug mode");

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