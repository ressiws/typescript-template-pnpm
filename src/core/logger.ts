/**
 * @file logger.ts
 * @version 1.0.0
 *
 * Copyright (c) 2026 swisser
 */

import fs from "fs";
import path from "path";
import winston from "winston";
import { Time } from "../utils/time.js";

type LogObject = {
	stack?: string;
} & Record<string, unknown>;

export enum LogCategory {
	COMMAND = "COMMAND",
	EVENT = "EVENT",
	STARTUP = "STARTUP",
	DATABASE = "DATABASE",
	SYSTEM = "SYSTEM",
	PERMISSION = "PERMISSION",
	GRAPHICS = "GRAPHICS",
}

const LOG_DIR = path.resolve("logs");
const LOG_RETENTION_DAYS = 7;

const getLogLevelEmoji = (level: string): string => {
	const emojis: Record<string, string> = {
		debug: "🐞",
		info: "🆗",
		success: "✅",
		error: "🔥",
		warn: "☣",
	};

	return emojis[level] || "ℹ️";
};

const cleanOldLogs = () => {
	const now = Date.now();
	const retentionPeriod = Time.days(LOG_RETENTION_DAYS);

	fs.readdir(LOG_DIR, (err, files) => {
		if (err) {
			console.error(`Error reading log directory: ${err.message}`);
			return;
		}

		files.forEach((file) => {
			const filePath = path.join(LOG_DIR, file);

			// Match files with the format "YYYY-MM-DD.log"
			const match = file.match(/^(\d{4}-\d{2}-\d{2})\.log$/);
			if (match) {
				const fileDate = new Date(match[1]); // Extract date from filename
				const fileAge = now - fileDate.getTime(); // Calculate file age in milliseconds

				// Check if the file is older than the retention period
				if (fileAge >= retentionPeriod) {
					fs.unlink(filePath, (err) => {
						if (err)
							console.error(`Error deleting old log file ${file}: ${err.message}`);
						else
							console.log(`Deleting file: ${file} (Age: ${Math.floor(fileAge / (24 * 60 * 60 * 1000))} days)`);
					});
				}
			}
			else
				console.log(`File ${file} does not match the log file pattern.`);
		});
	});
};

cleanOldLogs();
setInterval(cleanOldLogs, Time.hours(24)); // Run cleanup every 24 hours

export class Logger {
	private log_data: string | null;
	private logger: winston.Logger;

	private formatMessage(message: string, category?: LogCategory): string {
		if (!category)
			return message;

		return `[${category}] ${message}`;
	}

	constructor() {
		this.log_data = null;

		const Levels = {
			levels: {
				debug: 0,
				info: 1,
				success: 2,
				warn: 3,
				error: 4,
			},
			colors: {
				debug: "magenta",
				info: "cyan",
				success: "green",
				warn: "yellow",
				error: "red",
			},
		};

		const colorizer = winston.format.colorize();
		const dateFormat = () => new Date(Date.now()).toUTCString();

		const logger = winston.createLogger({
			level: "error",
			levels: Levels.levels,
			transports: [
				new winston.transports.Console({
					format: winston.format.combine(
						winston.format.timestamp(),
						winston.format.simple(),
						winston.format.printf((info) => {
							const ts = getLogLevelEmoji(info.level);
							let message = `${dateFormat()} | ${ts}  ${info.level.toUpperCase()} | ${info.message}`;
							message = info.obj
								? message +
								` ${typeof info.obj === "object" &&
									info.obj !== null &&
									"stack" in info.obj &&
									typeof (info.obj as LogObject).stack === "string"
									? (info.obj as LogObject).stack
									: typeof info.obj === "object"
										? JSON.stringify(info.obj)
										: info.obj
								} | `
								: message;
							message = this.log_data ? message + ` log_data:${JSON.stringify(this.log_data)} | ` : message;
							return colorizer.colorize(info.level, message);
						}),
					),
				}),
				new winston.transports.File({
					filename: `logs/${new Date().toISOString().split("T")[0]}.log`,
					handleExceptions: true,
					maxsize: 5242880, //5MB
					maxFiles: 5,
					zippedArchive: true,
					format: winston.format.printf((info) => {
						const ts = getLogLevelEmoji(info.level);
						let message = `${dateFormat()} | ${ts} ${info.level.toUpperCase()} | ${info.message}`;
						message = info.obj
							? message +
							` ${typeof info.obj === "object" &&
								info.obj !== null &&
								"stack" in info.obj &&
								typeof (info.obj as LogObject).stack === "string"
								? (info.obj as LogObject).stack
								: typeof info.obj === "object"
									? JSON.stringify(info.obj)
									: info.obj
							} | `
							: message;
						message = this.log_data ? message + ` log_data:${JSON.stringify(this.log_data)} | ` : message;
						return message;
					}),
				}),
			],
		});

		winston.addColors(Levels.colors);
		this.logger = logger;
	}

	public async debug(message: string, category?: LogCategory, obj?: unknown) {
		this.logger.log("debug", this.formatMessage(message, category), obj ? { obj } : undefined);
	}

	public async info(message: string, category?: LogCategory, obj?: unknown) {
		this.logger.log("info", this.formatMessage(message, category), obj ? { obj } : undefined);
	}

	public async success(message: string, category?: LogCategory, obj?: unknown) {
		this.logger.log("success", this.formatMessage(message, category), obj ? { obj } : undefined);
	}

	public async error(message: string, category?: LogCategory, obj?: unknown) {
		this.logger.log("error", this.formatMessage(message, category), obj ? { obj } : undefined);
	}

	public async warn(message: string, category?: LogCategory, obj?: unknown) {
		this.logger.log("warn", this.formatMessage(message, category), obj ? { obj } : undefined);
	}
}

export const logger = new Logger();
