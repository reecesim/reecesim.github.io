const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/southern-us-map.js",
  output: {
    filename: "southern-us-map-bundle.js",
    path: path.resolve(__dirname, "build"),
    library: "SouthernUSMap",
    libraryTarget: "umd",
    libraryExport: "default",
    globalObject: "this",
  },
  resolve: {
    extensions: [".js"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  optimization: {
    minimize: true,
  },
};
