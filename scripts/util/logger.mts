/**
 * @module Logger utility module.
 * @description Provides a utility for logging messages to the console.
 * @version 1.0.0
 * 
 * Copyright (c) 2025 DarkenLM https://github.com/darkenlm
 * Copyright (c) 2025 ressiws https://github.com/ressiws
 */

import chalk from "chalk";
import { loggerFormatDate } from "./date.mts";
import { getCallerFilePathAndPosition } from "./getCaller.mts";
import { deepClone } from "./object.mts";
import util from "util";
import path from "path";

const INTERNAL_LOG_SYM = Symbol("internal-log");

//#region ============== Types ==============
//#region ======= Private =======
interface _Logger_Internal_Level<T extends string> {
	name: T,
	color: LoggerColor
}
type _Logger_Internal_Levels<L extends Levels> = {
	[K in keyof L]: _Logger_Internal_Level<L[K]["name"]>
} & {
	[INTERNAL_LOG_SYM]: _Logger_Internal_Level<L[keyof L]["name"]>
}

type _Logger_Levels<L extends Levels> = { [K in keyof L]: (...args: unknown[]) => void }
	& { [K in keyof L as `p${Capitalize<string & K>}`]: (...args: unknown[]) => void }
//#endregion

//#region ======= Public =======
type LoggerColor = (message: string) => string;

/**
 * Represents a log level.
 */
interface Level<T extends string> {
	name: T,
	color: string | LoggerColor
}
type Levels = Record<string, Level<string>>

/**
 * Represents the options for a logger.
 */
interface LoggerOptions {
	/**
	 * Whether the logger is in debug mode.
	 */
	debug?: boolean,
	/**
	 * Whether to print the file path of the caller at each log point.
	 */
	printCallerFile?: boolean
	/**
	 * The root path to be used for relative file paths.
	 */
	root?: string
}

/**
 * Represents a logger.
 */
type Logger<L extends Levels> = _Logger_Levels<L> & _Logger<L>

type DefaultLogger = Logger<typeof DEFAULT_LOGGER_LEVELS>;
//#endregion
//#endregion

//#region ============== Constants ==============
const logColorNone = (message: string) => message;

const DEFAULT_LOGGER_LEVELS = {
	success: { name: "success", color: chalk.green },
	info: { name: "info", color: logColorNone },
	warn: { name: "warn", color: chalk.yellow },
	error: { name: "error", color: chalk.red },
} as const satisfies Levels;
//#endregion

// #region ============== Base ==============
class _Logger<L extends Levels> {
	private levels: _Logger_Internal_Levels<L>;

	private inDebugMode: boolean = false;
	private printCallerFile: boolean = false;
	private root: string = "";

	/**
	 * Creates a new instance of a Logger.
	 * 
	 * @param levels The levels to be used in the logger.
	 * @param options The options to be used in the logger.
	 */
	constructor(levels: L, options?: LoggerOptions) {
		this.inDebugMode = options?.debug ?? false;
		this.printCallerFile = options?.printCallerFile ?? false;
		this.root = options?.root ?? process.cwd();

		this.root = path.resolve(process.cwd(), this.root);

		this.levels = deepClone(levels) as unknown as _Logger_Internal_Levels<L>;
		this.levels[INTERNAL_LOG_SYM] = { name: "log", color: logColorNone };

		for (const level in levels) {
			// Correct color
			const color = levels[level].color;
			if (typeof color === "string") {
				if (color === "none") this.levels[level].color = logColorNone;
				else if (color[0] === "#") this.levels[level].color = chalk.hex(color);
				else if (color.startsWith("rgb")) {
					const [r, g, b] = color.match(/\d+/g)!.map(Number);
					this.levels[level].color = chalk.rgb(r, g, b);
				} else throw new Error(`Invalid color format for level '${level}': '${color}'`);
			}

			/**
			 * This block of code dynamically generates two properties for each logging level:
			 * 1. A property named after the logging level that logs a message if the logger is in debug mode.
			 * 2. A property named with a 'p' prefix and the logging level that logs a message unconditionally (persistent mode).
			 * 
			 * Both properties are functions that take a string message and any number of additional arguments.
			 * 
			 * @property {Function} level - The function that logs a message if the logger is in debug mode.
			 * @property {Function} pLevel - The function that logs a message unconditionally.
			 */
			Object.defineProperty(this, level, {
				value: (...args: unknown[]) => {
					if (this.inDebugMode) this._log(level, ...args);
				},
				writable: false,
				enumerable: true,
				configurable: false
			});

			Object.defineProperty(this, `p${level.charAt(0).toUpperCase()}${level.substring(1)}`, {
				value: (...args: unknown[]) => {
					this._log(level, ...args);
				},
				writable: false,
				enumerable: true,
				configurable: false
			});
		}
	}

	private _colorize(level: keyof _Logger_Internal_Levels<L>, message: string) {
		return this.levels[level].color(message);
	}

	private _log(level: keyof _Logger_Internal_Levels<L>, ...args: unknown[]) {
		let outMsg = "";
		if (this.printCallerFile) outMsg += `[${getCallerFilePathAndPosition(this.root, 3)}] `;
		outMsg += `[${loggerFormatDate(new Date())}] [${this.levels[level].name.toUpperCase()}]`;

		const nArgs = args.map(arg => typeof arg === "string" ? this._colorize(level, arg) : util.inspect(arg, false, 5, true));

		console.log(this._colorize(level, outMsg), ...nArgs);
	}

	public log(...args: unknown[]) {
		if (this.inDebugMode) this._log(INTERNAL_LOG_SYM, ...args);
	}

	public pLog(...args: unknown[]) {
		this._log(INTERNAL_LOG_SYM, ...args);
	}
}
//#endregion

//#region ============== Factory ==============
/**
 * Creates a new instance of a Logger.
 * 
 * @param levels The levels to be used in the logger.
 * @param options The options to be used in the logger.
 */
function createLogger<L extends Levels = typeof DEFAULT_LOGGER_LEVELS>(levels: L = DEFAULT_LOGGER_LEVELS as unknown as L, options?: LoggerOptions): Logger<L> {
	return new _Logger<L>(levels, options) as Logger<L>;

}

let logger: DefaultLogger | undefined;

/**
 * Gets or creates a global instance of a logger.
 * 
 * @param options The options to be used in the logger.
 * @returns The global logger.
 */
function getOrCreateGlobalLogger(options?: LoggerOptions): DefaultLogger {
	if (logger) return logger as DefaultLogger;

	logger = createLogger(DEFAULT_LOGGER_LEVELS, options);
	return logger;
}
//#endregion

export {
	LoggerColor,
	LoggerOptions,
	Levels,
	Logger,
	DefaultLogger,
	createLogger,
	getOrCreateGlobalLogger
};

// const test: Logger<typeof levels> = createLogger(levels, { debug: true, printCallerFile: true });
// console.log("TEST:", test);

// console.log("Hello, world!", 123, false, { a: 1, b: 2 }, [1, 2, 3], "Goodbye, world!");
// test.info("Hello, world!", 123, false, { a: 1, b: 2 }, [1, 2, 3], "Goodbye, world!");
// test.warn("Hello, world!", 123, false, { a: 1, b: 2 }, [1, 2, 3], "Goodbye, world!");
// test.error("Hello, world!", 123, false, { a: 1, b: 2 }, [1, 2, 3], "Goodbye, world!");
// test.pInfo("Hello, world!", 456, true, { c: 3, d: 4 }, [4, 5, 6], "Goodbye, world!");
// test.pWarn("Hello, world!", 456, true, { c: 3, d: 4 }, [4, 5, 6], "Goodbye, world!");
// test.pError("Hello, world!", 456, true, { c: 3, d: 4 }, [4, 5, 6], "Goodbye, world!");