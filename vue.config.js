const path = require('path')
const webpack = require('webpack')

const definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  WEBGL_RENDERER: true,
  CANVAS_RENDERER: true,
})

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    entry: {
      game: [path.resolve(__dirname, 'src/phaser/main.ts')],
      vendor: ['phaser'],
    },
    plugins: [definePlugin],
  },
}
