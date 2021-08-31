const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const rootPath = path.resolve(__dirname, '..')

module.exports = {
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  devtool: 'source-map',
  entry: path.resolve(rootPath, 'electron', 'main.ts'),
  target: 'electron-main',
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }, 
      {
        test: /\.(css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ],
      },
    ]
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  output: {
    path: path.resolve(rootPath, 'dist'),
    filename: '[name].js'
  },
  plugins: [
    new MiniCssExtractPlugin()
  ]
}
