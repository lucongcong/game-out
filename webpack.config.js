const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, dir);
}

const config = {
  entry: {
    main: resolve('/src/js/index.js')
  },
  output: {
    filename: 'bundle.js'
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    // proxy: {
    //   '/api/*': 'http://localhost:1900/src'
    // },
    inline: true,
    hot: true,
    port: 8080,
    overlay: true
  },
  resolve: {
    extensions: ['.js', '.css', '.scss', '.vue'], //省略后缀名
    alias: { //配置全局指代
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  module: {
    rules: [{
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: [resolve('src')],
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:8].[ext]'
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(
        JSON.parse(process.env.NODE_ENV == 'dev' || 'false')
      ),
      CACHE_VERSION: new Date().getTime()
    }),
    new HtmlWebpackPlugin({
      template: resolve('src/index.html')
    }),
    // 模块热更新
    new webpack.HotModuleReplacementPlugin()
    // new ServiceWorkerWebpackPlugin({
    //   entry: resolve('src/sw.js')
    // })
  ]
};
module.exports = config;