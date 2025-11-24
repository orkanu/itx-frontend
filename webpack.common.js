import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = path.dirname(__filename) // get the name of the directory

export default {
  entry: {
    app: './src/main.tsx',
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.ts', '.tsx', '.css'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  output: {
    filename: '[name]-[fullhash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  optimization: { runtimeChunk: true },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
      {
        test: /\.(svg|ico|png|jpg|jpeg|gif|webp)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name]-[fullhash].[ext]',
            outputPath: 'assets/img',
          },
        },
      },
      {
        test: /\.(otf|eot|ttf|woff2|woff)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name]-[fullhash].[ext]',
            outputPath: 'assets/font',
          },
        },
      },
    ],
  },
}
