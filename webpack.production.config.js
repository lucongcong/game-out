const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');

const pkg = require('./package.json');

function resolve(dir) {
  return path.join(__dirname, dir);
}

const config = {
  entry: {
    main: resolve('src/js/index.js'),
    vendor: Object.keys(pkg.dependencies)
  },
  output: {
    path: resolve('build'),
    filename: 'js/[name].[chunkhash:8].js',
    // publicPath: "/nono-wxbd/"
  },
  // 开发环境：cheap-module-eval-source-map
  // 生产环境：cheap-module-source-map
  // devtool: 'cheap-module-eval-source-map',
  resolve: {
    extensions: ['.js', '.css', '.scss'],
  },
  module: {
    rules: [{
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [{
            loader: "css-loader",
          }, {
            loader: 'postcss-loader'
          }]
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: "css-loader",
          }, {
            loader: "sass-loader"
          }, {
            loader: 'postcss-loader'
          }]
        })
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [{
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'img/[name].[hash:8].[ext]'
            }
          },
          "img-loader"
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[hash:8].[ext]'
        }
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['build']),
    new BundleAnalyzerPlugin(),
    new webpack.NamedChunksPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.BannerPlugin('nonobank'),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'js/[name].[chunkhash:8].js'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    new ExtractTextPlugin({
      filename: "css/[name].[chunkhash:8].css"
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorOptions: {
        discardComments: {
          removeAll: true
        }
      },
      canPrint: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new HtmlWebpackPlugin({
      template: resolve('index.html'),
      hash: true,
      minify: {
        caseSensitive: false,
        removeComments: true,
        removeEmptyAttributes: true,
        collapseWhitespace: true
      }
    }),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false')),
      CACHE_VERSION: new Date().getTime()
    }),
    // new ServiceWorkerWebpackPlugin({
    //   entry: resolve('src/sw.js')
    // })
  ]
}

module.exports = config;