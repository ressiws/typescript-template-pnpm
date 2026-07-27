/**
 * @file time.ts
 * @description Provides a centralized time utility for creating readable duration values.
 * @version 1.0.0
 *
 * Copyright (c) 2026 swisser
 */

export class Time {

	public static milliseconds(value: number): number {
		return value;
	}

	public static seconds(value: number): number {
		return value * 1000;
	}

	public static minutes(value: number): number {
		return value * 60 * 1000;
	}

	public static hours(value: number): number {
		return value * 60 * 60 * 1000;
	}

	public static days(value: number): number {
		return value * 24 * 60 * 60 * 1000;
	}

	public static weeks(value: number): number {
		return this.days(value * 7);
	}

	public static format(duration: number): string {

		if (duration < this.minutes(1))
			return `${duration / 1000} seconds`;

		if (duration < this.hours(1))
			return `${duration / this.minutes(1)} minutes`;

		if (duration < this.days(1))
			return `${duration / this.hours(1)} hour(s)`;

		if (duration < this.weeks(1))
			return `${duration / this.days(1)} day(s)`;

		return `${duration / this.weeks(1)} week(s)`;
	}
}