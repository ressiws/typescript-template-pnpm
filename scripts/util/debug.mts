/**
 * This function will get all functions. Inherited or not, enumerable or not. All functions are included.
 * 
 * @see https://stackoverflow.com/a/31055217
 * @param toCheck The object to check for functions.
 * @returns {string[]} An array containing all function names present in the object.
 */
function getAllFuncs(toCheck: object): string[] {
	const props: string[] = [];
	let obj = toCheck;
	do {
		props.push(...Object.getOwnPropertyNames(obj));
		// eslint-disable-next-line no-cond-assign
	} while (obj = Object.getPrototypeOf(obj));

	return props.sort().filter((e, i, arr) => {
		if (e != arr[i + 1] && typeof toCheck[e as keyof typeof toCheck] == "function")
			return true;

		return false;
	});
}

export {
	getAllFuncs
};