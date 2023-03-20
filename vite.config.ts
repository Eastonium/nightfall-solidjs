import { defineConfig } from "vite";
import devtools from "solid-devtools/vite";
import solidPlugin from "vite-plugin-solid";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [devtools({ autoname: true }), solidPlugin(), tsconfigPaths()],
	build: {
		target: "esnext",
		polyfillDynamicImport: false,
	},
});
