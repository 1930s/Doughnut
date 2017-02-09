const ExtractTextPlugin = require('extract-text-webpack-plugin');  
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/view/renderer.js',
  output: {
    path: './build',
    filename: 'view.js'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/, // in case we want to use React elsewhere later
      exclude: /node_modules/,
      loader: 'babel'
    }, {
      test:    /\.elm$/,
      exclude: [/elm-stuff/, /node_modules/],
      loader:  'elm-webpack?verbose=true&warn=true',
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style', 'css')
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract(
        'style',
        'css!sass?includePaths[]=' + __dirname + '/node_modules'
      )
    }]
  },
  resolve: {
    moduleDirectories: [
      __dirname + '/src/view',
      __dirname + '/src/elm'
    ],
    extensions: ['', '.js', '.elm']
  },
  plugins: [
    new ExtractTextPlugin('main.css'),
    new CopyWebpackPlugin([
      { from: './src/assets' },
    ])
  ],
  devServer: { inline: true },
  target: 'electron-renderer'
}