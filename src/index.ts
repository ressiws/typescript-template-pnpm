import { logger } from "./core/logger.js";
import { ShutdownManager } from "./core/shutdown.js";
import { Startup } from "./core/startup.js";

try {
	ShutdownManager.registerProcessListeners();

	await Startup.start();
}
catch (error) {
	logger.error(`Uncaught error in the startup process: ${error}`);
	process.exitCode = 1;
}