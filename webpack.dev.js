const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.join(__dirname, 'dev/src/index.js'),
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /(node_modules|dist|demo)/,
      use: [{
        loader: 'babel-loader'
      }]
    }, {
      test: /\.html$/,
      use: [{
        loader: 'html-loader'
      }]
    }]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.join(__dirname, 'dev/index.html'),
      filename: './index.html'
    })
  ],
  devServer: {
    historyApiFallback: true,
    contentBase: './',
    hot: true
  }
}
