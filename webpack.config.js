const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ExtensionReloader = require("webpack-extension-reloader");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: {
    content: [
      path.resolve(__dirname, "src/content/index.js"),
      path.resolve(__dirname, "src/assets/content.scss"),
    ],
    background: path.resolve(__dirname, "src/background/index.js"),
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            presets: [
              ["@babel/preset-env", { useBuiltIns: "entry", corejs: 3 }],
            ],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [require("autoprefixer")],
            },
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: { loader: "html-loader" },
      },
    ],
  },
  plugins: [
    new ExtensionReloader(),
    new MiniCssExtractPlugin({
      filename: "[name].bundle.css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/manifest.json"),
          to: "manifest.json",
        },
        {
          from: path.resolve(__dirname, "src/assets/icons"),
          to: "icons",
        },
      ],
    }),
    new Dotenv({
      path: ".env",
      safe: true,
    }),
  ],
};
