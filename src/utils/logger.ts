import path from "path";
import winston from "winston";
import fs from "fs";

type LogObject = {
	stack?: string;
} & Record<string, unknown>;

const LOG_DIR = path.resolve("logs");
const LOG_RETENTION_DAYS = 7;

const getLogLevelEmoji = (level: string): string => {
	const emojis: Record<string, string> = {
		debug: "🐞",
		info: "🆗",
		success: "✅",
		error: "🔥",
		warn: "☣",
		critical: "☠",
	};

	return emojis[level] || "ℹ️";
};

const cleanOldLogs = () => {
	const now = Date.now();
	const retentionPeriod = LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000;

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
setInterval(cleanOldLogs, 24 * 60 * 60 * 1000);

export class Logger {
	private log_data: string | null;
	private logger: winston.Logger;

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

	public async debug(message: string, obj?: unknown) {
		this.logger.log("debug", message, obj ? { obj } : undefined);
	}

	public async info(message: string, obj?: unknown) {
		this.logger.log("info", message, obj ? { obj } : undefined);
	}

	public async success(message: string, obj?: unknown) {
		this.logger.log("success", message, obj ? { obj } : undefined);
	}

	public async error(message: string, obj?: unknown) {
		this.logger.log("error", message, obj ? { obj } : undefined);
	}

	public async warn(message: string, obj?: unknown) {
		this.logger.log("warn", message, obj ? { obj } : undefined);
	}

	public async critical(message: string, obj?: unknown) {
		this.logger.log("critical", message, obj ? { obj } : undefined);
	}
}

export const logger = new Logger();
