// Last Updated: Wed Jul 06 2022 22:13:16 GMT+0100

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function dedent(templateStrings: TemplateStringsArray | string, ...values: any[]) {
	const matches: string[] = [];
	const strings = typeof templateStrings === "string" ? [templateStrings] : templateStrings.slice();

	// 1. Remove trailing whitespace.
	strings[strings.length - 1] = strings[strings.length - 1].replace(/\r?\n([\t ]*)$/, "");

	// 2. Find all line breaks to determine the highest common indentation level.
	for (let i = 0; i < strings.length; i++) {
		let match: RegExpMatchArray | null;

		// eslint-disable-next-line no-cond-assign
		if (match = strings[i].match(/\n[\t ]+/g)) {
			matches.push(...match);
		}
	}

	// 3. Remove the common indentation from all strings.
	if (matches.length) {
		const size = Math.min(...matches.map(value => value.length - 1));
		const pattern = new RegExp(`\n[\t ]{${size}}`, "g");

		for (let i = 0; i < strings.length; i++) {
			strings[i] = strings[i].replace(pattern, "\n");
		}
	}

	// 4. Remove leading whitespace.
	strings[0] = strings[0].replace(/^\r?\n/, "");

	// 5. Perform interpolation.
	let string = strings[0];

	for (let i = 0; i < values.length; i++) {
		string += values[i] + strings[i + 1];
	}

	return string;
}