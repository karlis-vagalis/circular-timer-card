import { defineConfig } from "@rspack/cli";
import { rspack } from "@rspack/core";

export default defineConfig({
	entry: {
		main: "./src/index.js",
	},
	resolve: {
		extensions: [".js", ".jsx"],
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
    new rspack.HtmlRspackPlugin({
			filename: "index.html",
			minify: false,
      templateContent: `
        <circular-timer-card></circular-timer-card>
      `
		}),
  ]
});
