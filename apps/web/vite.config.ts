import { readFileSync } from "node:fs";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const { version } = JSON.parse(
	readFileSync(new URL("package.json", import.meta.url), "utf8"),
);

export default defineConfig({
	define: { __APP_VERSION__: JSON.stringify(version) },
	resolve: { tsconfigPaths: true },
	server: { allowedHosts: [".ts.net"] },
	plugins: [
		cloudflare({ viteEnvironment: { name: "ssr" } }),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
	],
});
