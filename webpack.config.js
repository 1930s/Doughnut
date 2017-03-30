const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = {
  entry: {
    view: './src/view/renderer.js',
    preferences: './src/view/preferences.js',
    player: './src/view/player.js'
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.jsx?$/, // in case we want to use React elsewhere later
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader?presets[]=es2015',
          options: {
            presets: ['es2015']
          }
        }
      ]
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
   externals: [
    "sequelize"
   ],
  resolve: {
    modules: [
      __dirname + '/node_modules',
      __dirname + '/src/view',
      __dirname + '/src/elm'
    ],
    extensions: ['.js', '.elm']
  },
  plugins: [
    new ExtractTextPlugin('main.css'),
    new CopyWebpackPlugin([
      { from: './src/assets', ignore: '.DS_Store' },
    ])
  ],
  devServer: { inline: true },
  target: 'electron-renderer',
  node: {
    __dirname: false,
    __filename: false
  }
}