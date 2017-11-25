var webpack = require("webpack"),
    path = require("path"),
    fileSystem = require("fs"),
    env = require("./utils/env"),
    CleanWebpackPlugin = require("clean-webpack-plugin"),
    CopyWebpackPlugin = require("copy-webpack-plugin"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    WriteFilePlugin = require("write-file-webpack-plugin");

// load the secrets
var alias = {};

var secretsPath = path.join(__dirname, ("secrets." + env.NODE_ENV + ".js"));

var fileExtensions = ["jpg", "jpeg", "png", "gif", "eot", "otf", "svg", "ttf", "woff", "woff2"];

if (fileSystem.existsSync(secretsPath)) {
  alias["secrets"] = secretsPath;
}

var options = {
  entry: {
    options: path.join(__dirname, "src", "js", "options.js"),
    "content-extractor": path.join(__dirname, "src", "js", "content-extractor.js"),
    "content-main": path.join(__dirname, "src", "js", "content-main.js"),
    "search-box-creater": path.join(__dirname, "src", "js", "search-box-creater.js"),
    background: path.join(__dirname, "src", "js", "background.js")
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].js"
  },
  chromeExtensionBoilerplate: {
    notHotReload: ["content-extractor", "content-main", "search-box-creater"]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: "style-loader!css-loader",
        exclude: /node_modules/
      },
      {
        test: new RegExp('\.(' + fileExtensions.join('|') + ')$'),
        loader: "file-loader?name=[name].[ext]",
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    alias: alias
  },
  plugins: [
    // clean the build folder
    new CleanWebpackPlugin(["build"]),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV),
      "process.env.DESC": JSON.stringify(env.DESC),
      "process.env.PACK_VER": JSON.stringify(env.PACK_VER),
      "process.env.MAN_VER": JSON.stringify(env.MAN_VER)
    }),
    new CopyWebpackPlugin([{
      from: "src/manifest.json",
      transform: function (content, path) {
        // generates the manifest file using the package.json informations
        const varJSON = {
          description: process.env.DESC,
          version: parseFloat(process.env.PACK_VER),
          manifest_version: parseInt(process.env.MAN_VER)
        };
        const contentJSON = JSON.parse(content.toString())

        return Buffer.from(JSON.stringify(
          Object.assign(varJSON, contentJSON)
        ))
      }
    }]),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "options.html"),
      filename: "options.html",
      chunks: ["options"]
    }),
    new WriteFilePlugin()
  ]
};

if (env.NODE_ENV === "development") {
  options.devtool = "cheap-module-eval-source-map";
}

module.exports = options;
