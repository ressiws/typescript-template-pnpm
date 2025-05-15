import { logger } from "./utils/logger.js";
import { loader } from "./utils/loader.js";

// Initialize the loader and handle any errors during the startup process
await loader.init().catch((error) => {
	logger.error(`Uncaught error in the loader initialization: ${error}`);
	process.exit(1);
});

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