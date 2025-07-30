import "@utils/exception.js";
import { logger } from "./utils/logger.js";
import { loader } from "./utils/loader.js";

// Initialize the loader and handle any errors during the startup process
await loader.init().catch((error) => {
	logger.error(`Uncaught error in the loader initialization: ${error}`);
	process.exit(1);
});