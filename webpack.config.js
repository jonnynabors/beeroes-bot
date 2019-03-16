const { readdirSync } = require("fs");
const webpack = require("webpack");
const { join } = require("path");

module.exports = {
  entry: "./src/app.ts",
  target: "node",
  mode: "development",
  module: {
    rules: [
      {
        test: /^(?!.*\.test\.ts$).*\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  output: {
    path: join(__dirname, "build"),
    filename: "server.ts"
  }
};