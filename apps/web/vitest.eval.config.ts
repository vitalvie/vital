import { existsSync } from "node:fs";
import { defineConfig } from "vitest/config";

if (existsSync(".env")) process.loadEnvFile(".env");

export default defineConfig({
	test: {
		include: ["src/**/*.eval.ts"],
		testTimeout: 60_000,
		retry: 1,
	},
});
