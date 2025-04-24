import { defineConfig } from "@rspack/cli";

export default defineConfig({
	entry: {
		main: "./src/index.js",
	},
	resolve: {
		extensions: [".js", ".jsx"],
	},
	module: {
		rules: [
			{
				test: /\.jsx$/,
				use: [
					{
						loader: "babel-loader",
						options: {
							presets: ["solid"],
							plugins: ["solid-refresh/babel"],
						},
					},
				],
			},
		],
	},
});
