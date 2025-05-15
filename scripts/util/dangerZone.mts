/**
 * @file dangerZone.mts
 * @description This module contains dangerous utilities or functions that are related to critical operations.
 * @version 1.0.0
 *
 * Copyright (c) 2025 DarkenLM https://github.com/darkenlm
 * Copyright (c) 2025 ressiws https://github.com/ressiws
 */

import readline from "readline";

type ConfirmMessageFormatter = (header: string, ...args: unknown[]) => string;

const DEFAULT_CONFIRM_MESSAGE_YES_NO = `Are you sure you want to perform the following operation: {{OPERATION}}? ([Y]es/[N]o) >`;
const DEFAULT_CONFIRM_MESSAGE_PASSPHRASE = `Are you sure you want to perform the following operation: {{OPERATION}}?\nPlease enter '{{PASSPHRASE}}' to confirm: `;
const DEFAULT_CONFIRM_MESSAGE_FORMATTER = (operation: string, passphrase?: string) => {
	let msg = DEFAULT_CONFIRM_MESSAGE_YES_NO.replace("{{OPERATION}}", operation);
	if (passphrase)
		msg = msg.replace("{{PASSPHRASE}}", passphrase);

	return msg;
};

async function confirmDangerousOperationYesNo(operation: string | ConfirmMessageFormatter, repeat: boolean = false): Promise<boolean> {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	const prompt = (query: string): Promise<string> => new Promise(resolve => { rl.question(query, resolve); });

	const msg = typeof operation === "string" ? DEFAULT_CONFIRM_MESSAGE_FORMATTER(operation) : operation(DEFAULT_CONFIRM_MESSAGE_YES_NO);

	// eslint-disable-next-line no-async-promise-executor
	return new Promise(async resolve => {
		while (true) {
			const answer = await prompt(msg);
			const res = answer.toLowerCase();
			if (res === "yes" || res === "y") {
				rl.close();
				resolve(true);
				break;
			} else if (res === "no" || res === "n" || !repeat) {
				rl.close();
				resolve(false);
				break;
			} else {
				continue;
			}
		}
	});
}

async function confirmDangerousOperationPassphrase(operation: string | ConfirmMessageFormatter, passphrase: string, repeat: boolean = false): Promise<boolean> {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	const prompt = (query: string): Promise<string> => new Promise(resolve => { rl.question(query, resolve); });

	const msg = typeof operation === "string" ? DEFAULT_CONFIRM_MESSAGE_FORMATTER(operation, passphrase) : operation(DEFAULT_CONFIRM_MESSAGE_PASSPHRASE, passphrase);

	// eslint-disable-next-line no-async-promise-executor
	return new Promise(async resolve => {
		while (true) {
			const answer = await prompt(msg);
			if (answer === passphrase) {
				rl.close();
				resolve(true);
				break;
			} else if (repeat) {
				continue;
			} else {
				rl.close();
				resolve(false);
				break;
			}
		}
	});
}

export {
	confirmDangerousOperationYesNo,
	confirmDangerousOperationPassphrase
};