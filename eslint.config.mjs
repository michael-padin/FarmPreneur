// @ts-check
import path from "node:path"
import globals from "globals"
import { fileURLToPath } from "node:url"
import js from "@eslint/js"
import ts from "typescript-eslint"
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"
import { FlatCompat } from "@eslint/eslintrc"
import { fixupConfigRules } from "@eslint/compat"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all
})

// eslint-disable-next-line import/no-anonymous-default-export
export default [
	{
		ignores: [
			"**/.next",
			"**/.cache",
			"**/public",
			"**/node_modules",
			"**/next-env.d.ts",
			"**/next.config.ts",
			"src/components/ui/**/*",
			"**/*.css"
		]
	},
	...fixupConfigRules(compat.extends("next/core-web-vitals")),
	...ts.configs.recommended,
	eslintPluginPrettierRecommended,
	// Add more flat configs here
	{
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			parserOptions: {
				ecmaFeatures: {
					jsx: true
				}
			},
			globals: {
				...globals.browser
			}
		},
		rules: {
			"no-var": "warn",
			"import/no-anonymous-default-export": "warn",
			"@typescript-eslint/no-unused-vars": "warn",
			"react/jsx-uses-react": "error"
		}
	}
]
