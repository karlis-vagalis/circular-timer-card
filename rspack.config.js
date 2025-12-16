import { defineConfig } from "@rspack/cli";

export default defineConfig({
	devtool: false,
	entry: {
		main: "./src/circular-timer-card.js",
	},
	output: {
		clean: true,
		filename: "circular-timer-card.js",
	},
});
