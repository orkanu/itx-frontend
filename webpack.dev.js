import path from 'path'
import { fileURLToPath } from 'url'
import { merge } from 'webpack-merge'
import common from './webpack.common.js'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = path.dirname(__filename) // get the name of the directory

export default merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    liveReload: true,
    open: {
      target: ['http://localhost:8080'],
      app: {
        name: 'Google Chrome',
      },
    },
    port: 8080,
    historyApiFallback: true,
    compress: true,
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Products Shop',
      template: './src/index.html',
    }),
  ],
})
