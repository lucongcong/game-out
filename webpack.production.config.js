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
    path: resolve('dist'),
    filename: 'js/[name].[chunkhash:8].js',
  },
  // 开发环境：cheap-module-eval-source-map 使用 cheap 模式可以大幅提高 souremap 生成的效率；使用 eval 方式可大幅提高持续构建效率使用 module 可支持 babel 这种预编译工具（在 webpack 里做为 loader 使用）使用 eval-source-map 模式可以减少网络请求
  // 生产环境：cheap-module-source-map
  // devtool: 'cheap-module-eval-source-map',
  resolve: {
    extensions: ['.js', '.css', '.vue', '.scss'],
    alias: { //配置全局指代
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  module: {
    rules: [{
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
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
    new CleanWebpackPlugin(['dist']),
    new BundleAnalyzerPlugin(), //支持缩小包 可解析他们绑定模块的实际尺寸，可显示了他们的gzip大小
    new webpack.NamedChunksPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.BannerPlugin('nonobank'), //在chunk前添加头名称
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin({ //公共模块的提取，对import 单个模块的加载的提取
      name: 'common',
      filename: 'js/[name].[chunkhash:8].js'
    }),
    new webpack.optimize.UglifyJsPlugin({ //js压缩
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    new ExtractTextPlugin({ //该插件主要是对css的打包输出
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
    new webpack.DefinePlugin({ //允许你创建一个在编译时可以配置的全局常量
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new HtmlWebpackPlugin({ //html压缩配置
      template: resolve('src/index.html'),
      hash: true,
      minify: {
        caseSensitive: false,
        removeComments: true,
        removeEmptyAttributes: true,
        collapseWhitespace: true
      }
    }),
    new webpack.DefinePlugin({ //定义环境类型
      __DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false')),
      CACHE_VERSION: new Date().getTime()
    }),
    // new ServiceWorkerWebpackPlugin({
    //   entry: resolve('src/sw.js')
    // })
  ]
}

module.exports = config;