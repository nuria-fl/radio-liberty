var path = require("path");
var webpack = require("webpack");

// Phaser webpack config
var phaserModule = path.join(__dirname, "/node_modules/phaser/");
var phaser = path.join(phaserModule, "src/phaser.js");

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || "true")),
  WEBGL_RENDERER: true,
  CANVAS_RENDERER: true
});

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    entry: {
      game: [path.resolve(__dirname, "src/phaser/main.ts")],
      vendor: ["phaser"]
    },
    plugins: [definePlugin]
  }
};
