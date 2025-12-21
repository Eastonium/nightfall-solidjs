import { defineConfig } from "vite";
import devtools from "solid-devtools/vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
	plugins: [devtools({ autoname: true }), solidPlugin()],
	server: {
		port: 3000,
	},
	build: {
		target: "esnext",
	},
});
