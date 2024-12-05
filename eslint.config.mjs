// @ts-check
import { FlatCompat } from "@eslint/eslintrc"

const compat = new FlatCompat({
	baseDirectory: import.meta.dirname
})

const eslintConfig = [
	...compat.config({
		extends: ["next", "next/core-web-vitals", "next/typescript", "prettier"],
		rules: {
			"no-var": "warn",
			"@typescript-eslint/ban-ts-comment": "warn",
			"import/no-anonymous-default-export": "warn",
			"@typescript-eslint/no-unused-vars": "warn",
			"react/jsx-uses-react": "error"
		},
		ignorePatterns: [
			"**/.next",
			"**/.cache",
			"**/public",
			"**/node_modules",
			"**/next-env.d.ts",
			"**/next.config.ts",
			"src/components/ui/**/*",
			"**/*.css"
		]
	}),
]

export default eslintConfig
