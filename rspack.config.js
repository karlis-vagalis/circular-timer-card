import { defineConfig } from '@rspack/cli';

export default defineConfig({
  entry: {
    main: './src/index.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['solid'],
              plugins: ['solid-refresh/babel'],
            },
          },
        ],
      },
    ],
  },
});