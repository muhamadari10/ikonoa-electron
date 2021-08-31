const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const rootPath = path.resolve(__dirname, '..')

module.exports = {
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    mainFields: ['main', 'module', 'browser']
  },
  entry: path.resolve(rootPath, 'src', 'App.tsx'),
  target: 'electron-renderer',
  devtool: 'source-map',
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
  devServer: {
    contentBase: path.join(rootPath, 'dist/renderer'),
    compress: true,
    hot: true,
    host: '0.0.0.0',
    port: 4000,
    publicPath: '/',
    historyApiFallback: true,
    watchOptions: { aggregateTimeout: 300, poll: 1000 },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  output: {
    path: path.resolve(rootPath, 'dist/renderer'),
    filename: 'js/[name].js',
    publicPath: './'
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin()
  ]
}
