/**
 * @file config.ts
 * @description Contains both general and builder-specific configurations.
 * @version 1.0.0
 */

export const config = {
	/** Debug mode */
	maintenance: false,

	/** Logger configuration */
	logger: {
		/** Number of days to keep log files before deleting */
		retentionDays: 7,
	}
};