const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const options = {
  mode: process.env.NODE_ENV,
  entry: {
    content: [
      path.resolve(__dirname, "src/content/index.js"),
      path.resolve(__dirname, "src/content/content.scss"),
    ],
    background: "./src/background/index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: [
          {
            loader: "source-map-loader",
          },
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              presets: [
                ["@babel/preset-env", { useBuiltIns: "entry", corejs: 3 }],
              ],
              plugins: [
                "@babel/plugin-transform-runtime",
                "@babel/plugin-proposal-optional-chaining",
              ],
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
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
    new webpack.ProgressPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].bundle.css",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "manifest.json"),
          to: "manifest.json",
          force: true,
          transform: function (content) {
            return Buffer.from(
              JSON.stringify({
                version: process.env.npm_package_version,
                description: process.env.npm_package_description,
                ...JSON.parse(content.toString()),
              })
            );
          },
        },
        {
          from: path.resolve(__dirname, "src/icons"),
          to: "icons",
        },
      ],
    }),
  ],
  target: "web",
};

if (process.env.NODE_ENV === "development") {
  options.devtool = "cheap-module-source-map";
} else {
  options.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  };
}

module.exports = options;
