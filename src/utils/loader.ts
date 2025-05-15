/**
 * @file loader.ts
 * @description  A file loader that logs messages while loading components or steps.
 * @version 1.0.0
 */

import { config } from "@/config.js";
import { logger } from "./logger.js";

class Loader {
	constructor() { }

	/**
     * Starts the boot process and logging the status
     */
	public static async init() {
		logger.info("Initializing TypeScript PNPM Template..");

		if (config.maintenance)
			logger.warn("Maintenance mode is enabled. This should not be used in production.");

		await this.simulateLoading("UserModule");

		logger.success("Typescript PNPM Template has been successfully started.");
	}

	/**
     * Private method for simulating the loading of a component or module (example only)
     */
	private static async simulateLoading(component: string) {
		logger.info(`Loading '${component}' component...`);

		// Simulates component loading delay (1-2 seconds)
		await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 1000));

		logger.success(`The component '${component}' has been successfully loaded.`);
	}
}

export const loader = Loader;