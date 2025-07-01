import { defineConfig } from "@rspack/cli";
import { rspack } from "@rspack/core";

const mode = process.env.NODE_ENV || "development";
const prod = mode === "production";

console.log("Production:", prod);

export default defineConfig({
  mode,
  devtool: prod ? false : "inline-source-map",
  entry: {
    main: "./src/index.tsx",
  },
  resolve: {
    extensions: ["...", ".ts", ".tsx", ".jsx"],
  },
  output: {
    filename: "polytime-card.js",
  },
  module: {
    rules: [
		{
        test: /\.css$/,
        use: [
          "css-loader",
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
        type: "javascript/auto",
      },
      {
          test: /\.[t|j]sx$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-typescript',
                  "solid"
                ],
                plugins: [
                  "solid-refresh/babel"
                ]
              }
            }
          ]
        }
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
