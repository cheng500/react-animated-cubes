const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.join(__dirname, 'demo/js/index.js'),
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /(node_modules|src)/,
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
      template: path.join(__dirname, 'demo/index.html'),
      filename: './index.html'
    })
  ],
  devServer: {
    historyApiFallback: true,
    contentBase: './',
    hot: true
  }
}
