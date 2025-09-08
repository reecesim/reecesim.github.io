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
      {
        test: /\.(png|jpe?g|jfif|gif|webp|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "[contenthash][ext]",
        },
      },
    ],
  },
  optimization: {
    minimize: true,
  },
};
