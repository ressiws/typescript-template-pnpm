import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
});

export default [{
	ignores: ["**/node_modules", "**/dist"],
}, ...compat.extends(
	"eslint:recommended",
	"plugin:@typescript-eslint/eslint-recommended",
	"plugin:@typescript-eslint/recommended",
), {
	plugins: {
		"@typescript-eslint": typescriptEslint,
	},

	languageOptions: {
		globals: {
			...globals.node,
		},

		parser: tsParser,
	},

	rules: {
		semi: ["error", "always"],

		indent: ["error", "tab", {
			SwitchCase: 1,
		}],

		quotes: ["error", "double", {
			allowTemplateLiterals: true,
		}],

		"@typescript-eslint/explicit-member-accessibility": ["error", {
			accessibility: "explicit",

			overrides: {
				accessors: "off",
				constructors: "off",
				methods: "explicit",
				properties: "explicit",
				parameterProperties: "off",
			},
		}],

		"@typescript-eslint/explicit-function-return-type": ["error", {
			allowExpressions: true,
			allowTypedFunctionExpressions: true,
			allowHigherOrderFunctions: true,
			allowDirectConstAssertionInArrowFunctions: false,
			allowConciseArrowFunctionExpressionsStartingWithVoid: false,
			allowFunctionsWithoutTypeParameters: true,
			allowedNames: [],
			allowIIFEs: true,
		}],

		"@typescript-eslint/no-unused-vars": ["error", {
			args: "all",
			argsIgnorePattern: "^_",
			caughtErrors: "all",
			caughtErrorsIgnorePattern: "^_",
			destructuredArrayIgnorePattern: "^_",
			varsIgnorePattern: "^_",
			ignoreRestSiblings: true,
		}],
	},
}];