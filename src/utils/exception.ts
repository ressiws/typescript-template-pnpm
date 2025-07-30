import { logger } from "./logger.js";

// Catch any uncaught exceptions (e.g., thrown errors not handled in try/catch)
process.on("uncaughtException", (error) => {
	logger.error(`Uncaught exception: ${error}`);
	process.exit(1);
});

// Catch any unhandled promise rejections (e.g., rejected promises not awaited or caught)
process.on("unhandledRejection", (reason) => {
	logger.error(`Unhandled promise rejection: ${reason}`);
	process.exit(1);
});