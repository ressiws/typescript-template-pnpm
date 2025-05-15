/**
 * @file rand.mts
 * @description This module contains random-based utilities.
 * @version 1.0.0
 *
 * Copyright (c) 2025 DarkenLM https://github.com/darkenlm
 * Copyright (c) 2025 ressiws https://github.com/ressiws
 */

import { wordList } from "./words.mts";

function generateRandomPhrase(words: number = 4, separator: string = "-"): string {
	const phrase = [];
	for (let i = 0; i < words; i++) {
		const randomIndex = Math.floor(Math.random() * wordList.length);
		phrase.push(wordList[randomIndex]);
		wordList.splice(randomIndex, 1);
	}
	return phrase.join(separator);
}

export {
	generateRandomPhrase
};