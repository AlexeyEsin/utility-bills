/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const distPath = `${__dirname}/dist`;

module.exports = (env) => {
  const isProd = env.production;
  const isDev = env.development;

  const cssLoaders = (isLessLoader) =>
    [
      isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          importLoaders: isLessLoader ? 2 : 1,
          sourceMap: isProd,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: isProd,
        },
      },
      isLessLoader && 'less-loader',
    ].filter(Boolean);

  return {
    mode: isProd ? 'production' : 'development',
    devtool: 'source-map',
    entry: ['./src/index.tsx'],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      modules: ['node_modules', 'src'],
    },
    output: {
      path: distPath,
      pathinfo: isDev,
      filename: isDev ? '[name].js' : '[name]-[contenthash].js',
      chunkFilename: isDev ? '[name].chunk.js' : '[name]-[contenthash].js',
      publicPath: '/',
      clean: true,
    },
    devServer: {
      port: 8000,
      historyApiFallback: true,
    },
    optimization: {
      minimize: isProd,
      minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: 'src/index.html' }),
      isDev && new ReactRefreshWebpackPlugin({ overlay: false }),
      isProd && new MiniCssExtractPlugin({ filename: '[name]-[contenthash].css' }),
      new Dotenv(),
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.[jt]sx?/,
          exclude: /node_modules/,
          loader: 'ts-loader',
          options: {
            transpileOnly: isProd,
          },
        },
        {
          test: /\.css$/,
          use: cssLoaders(false),
        },
        {
          test: /\.less$/,
          use: cssLoaders(true),
        },
      ],
    },
  };
};
