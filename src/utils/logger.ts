/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import winston from "winston";

type LogObject = {
	stack?: string;
} & Record<string, unknown>;

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
		const dateFormat = () => {
			return new Date(Date.now()).toUTCString();
		};

		const logger = winston.createLogger({
			level: "error",
			levels: Levels.levels,
			transports: [
				new winston.transports.Console({
					format: winston.format.combine(
						winston.format.timestamp(),
						winston.format.simple(),
						winston.format.printf((info) => {
							let ts = "";
							switch (info.level) {
								case "debug":
									ts = "🐞";
									break;
								case "info":
									ts = "🆗";
									break;
								case "success":
									ts = "✅";
									break;
								case "error":
									ts = "🔥";
									break;
								case "warn":
									ts = "☣";
									break;
								case "critical":
									ts = "☠";
									break;
							}

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
					filename: `logs/stdio/${new Date().toISOString().split("T")[0]}.log`,
					handleExceptions: true,
					maxsize: 5242880, //5MB
					maxFiles: 5,
					zippedArchive: true,
					format: winston.format.printf((info) => {
						let ts = "";
						switch (info.level) {
							case "debug":
								ts = "⚙";
								break;
							case "info":
								ts = "🆗";
								break;
							case "success":
								ts = "✅";
								break;
							case "error":
								ts = "🔥";
								break;
							case "warn":
								ts = "☣";
								break;
						}

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

		logger.on("logging", function (transport, level, msg, meta) {
			console.log("logged");
		});

		this.logger.stream;
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
