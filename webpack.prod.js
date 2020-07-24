const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  target: 'web',
  entry: path.join(__dirname, '/src/index.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /(node_modules|dist|demo|dev)/,
      use: [{
        loader: 'babel-loader'
      }]
    }]
  },
  resolve: {
    alias: {
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    }
  },
  optimization: {
    minimize: false
  },
  externals: [nodeExternals()]
}
