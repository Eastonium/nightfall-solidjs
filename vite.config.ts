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
	// Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
	//
	// 1. prevent vite from obscuring rust errors
	clearScreen: false,
	// 2. tauri expects a fixed port, fail if that port is not available
	server: {
		port: 1420,
		strictPort: true,
		watch: {
		// 3. tell vite to ignore watching `src-tauri`
		ignored: ["**/src-tauri/**"],
		},
	},
});
