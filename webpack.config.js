const ExtractTextPlugin = require('extract-text-webpack-plugin');  
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    view: './src/view/renderer.js',
    main: './src/app/main.js'
  },
  output: {
    path: './build',
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.jsx?$/, // in case we want to use React elsewhere later
      exclude: /node_modules/,
      use: 'babel-loader'
    }, {
      test:    /\.elm$/,
      exclude: [/elm-stuff/, /node_modules/],
      use:  'elm-webpack-loader?verbose=true&warn=true',
    }, {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader', 'import-glob-loader']
      })
    }]
  },
  resolve: {
    modules: [
      __dirname + '/src/view',
      __dirname + '/src/elm'
    ],
    extensions: ['.js', '.elm']
  },
  plugins: [
    new ExtractTextPlugin('main.css'),
    new CopyWebpackPlugin([
      { from: './src/assets' },
    ])
  ],
  devServer: { inline: true },
  target: 'electron-renderer',
  node: {
    __dirname: false,
    __filename: false
  }
}