/**
 * @file shutdown.ts
 * @description Graceful application shutdown manager.
 * @version 1.0.0
 *
 * Copyright (c) 2026 swisser
 */

import { logger } from "@/core/logger.js";

export class ShutdownManager {
	private static shutting_down = false;

	public static registerProcessListeners(): void {
		process.once("SIGINT", () => this.shutdown("SIGINT", 0));
		process.once("SIGTERM", () => this.shutdown("SIGTERM", 0));
		process.once("SIGQUIT", () => this.shutdown("SIGQUIT", 0));

		process.once("uncaughtException", async (error) => {
			logger.error(`Uncaught exception: ${error}`);
			await this.shutdown("uncaughtException", 1);
		});

		process.once("unhandledRejection", async (reason) => {
			logger.error(`Unhandled rejection: ${reason}`);
			await this.shutdown("unhandledRejection", 1);
		});
	}

	private static async shutdown(reason: string, exit_code: number): Promise<void> {
		if (this.shutting_down)
			return;

		this.shutting_down = true;

		logger.warn(`Shutdown requested (${reason}).`);

		try {
			logger.info("Stopping cron tasks...");



			logger.success("Shutdown completed.");
		}
		catch (error) {
			logger.error(`Error during shutdown: ${error}`);
			exit_code = 1;
		}

		process.exitCode = exit_code;
	}
}