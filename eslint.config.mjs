// @ts-check
import globals from "globals"
import { FlatCompat } from "@eslint/eslintrc"

const compat = new FlatCompat({
	baseDirectory: import.meta.dirname
})

const eslintConfig = [
	...compat.config({
		extends: ["next/core-web-vitals", "next/typescript", "prettier"],
	}),
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
			"@typescript-eslint/ban-ts-comment": "warn",
			"import/no-anonymous-default-export": "warn",
			"@typescript-eslint/no-unused-vars": "warn",
			"react/jsx-uses-react": "error"
		}
	}
]

export default eslintConfig
