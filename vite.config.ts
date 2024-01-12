import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import devtools from "solid-devtools/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [
		devtools({
			autoname: true,
			locator: {
				targetIDE: "vscode",
				key: "Ctrl",
				jsxLocation: true,
				componentLocation: true,
			},
		}),
		solid({ hot: false }),
		tsconfigPaths(),
	],
	build: {
		target: "esnext",
	},
});
