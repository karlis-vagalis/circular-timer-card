import { defineConfig } from "@rspack/cli";
import { rspack } from "@rspack/core";

const mode = process.env.NODE_ENV || "development";
const prod = mode === "production";

console.log("Production:", prod)

export default defineConfig({
	mode,
	devtool: prod ? false : "inline-source-map",
	entry: {
		main: "./src/index.js",
	},
	resolve: {
		extensions: [".js", ".jsx"],
	},
	output: {
		filename: "polytime-card.js",
	},
	experiments: {
		css: true,
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
			{
				test: /\.css$/,
				use: [
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: {
									"@tailwindcss/postcss": {},
								},
							},
						},
					},
				],
				type: "css",
			},
		],
	},
	plugins: [
		!prod &&
			new rspack.HtmlRspackPlugin({
				filename: "index.html",
				minify: false,
				templateContent: `
        <polytime-card></polytime-card>
      `,
			}),
	],
});
