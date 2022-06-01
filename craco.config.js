const { whenDev, whenProd, when } = require('@craco/craco');
const WebpackBar = require('webpackbar');
const CracoLessPlugin = require('craco-less');
const compressionWebpackPlugin = require("compression-webpack-plugin");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
// craco.config.js
module.exports = {
  style: {
    postcssOptions: {
      plugins: [],
    },
  },
  babel: {
    plugins: [
      ["import", { libraryName: "antd", libraryDirectory: 'es', style: true }],
      ['@babel/plugin-proposal-decorators', { legacy: true }]
    ]
  },
  plugins: [
    { // antd主题色的配置
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {},
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  webpack: {
    plugins: [
      new compressionWebpackPlugin({ // gzip压缩
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        deleteOriginalAssets: false,
        test: /\.js$|\.json$|\.css/,
        threshold: 1024 * 1,
        minRatio: 0.7,
      }),
      new WebpackBar({
        profile: true
      }),
      // new BundleAnalyzerPlugin({
      //   analyzerPort: '8889',
      // }),
      new SimpleProgressWebpackPlugin()
    ],
    configure: (config, { env, paths }) => {
      whenProd(() => {
        console.log(process.env);
        config.devtool = false;
        config.externals = {
          moment: ['moment'],
          "flv.js": ['flvjs']
        };
        config.optimization = {
          splitChunks: {
            chunks: 'async',
            minSize: 1024 * 20,
            maxAsyncRequests: 5,
            maxInitialRequests: 4,
            automaticNameDelimiter: '~',
            name: "vender",
            cacheGroups: {
              common: {
                name: 'chunk-common',
                chunks: 'all',
                test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-redux|redux-saga|dva|react-router-dom|draft-js\/lib|core-js|@antv\/data-set\/build|)[\\/]/,
                priority: -10,
              },
              antd: {
                name: 'chunk-antd',
                chunks: 'all',
                test: /[\\/]node_modules[\\/](@ant-design|antd|immutable\/dist|rc-calendar\/es|braft-finder\/dist|lodash|lodash-es|rc-tree\/es)[\\/]/,
                priority: -11,
              }
            }
          }
        };
        when(process.env.NODE_ENV === "dev", () => {
          config.plugins.push(new BundleAnalyzerPlugin({
            analyzerPort: '8889',
          }));
        })
      })
      return config;
    }

    // configure: (config, { env, paths }) => {
    //   config.devtool = false;
    //   config.externals = {
    //     moment: ['moment'],
    //     "flv.js": ['flvjs']
    //   };
    //   config.optimization = {
    //     splitChunks: {
    //       chunks: 'async',
    //       minSize: 1024 * 20,
    //       maxAsyncRequests: 5,
    //       maxInitialRequests: 4,
    //       automaticNameDelimiter: '~',
    //       name: "vender",
    //       cacheGroups: {
    //         common: {
    //           name: 'chunk-common',
    //           chunks: 'all',
    //           test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-redux|redux-saga|dva|react-router-dom|draft-js\/lib|core-js|@antv\/data-set\/build|)[\\/]/,
    //           priority: -10,
    //         },
    //         antd: {
    //           name: 'chunk-antd',
    //           chunks: 'all',
    //           test: /[\\/]node_modules[\\/](@ant-design|antd|immutable\/dist|rc-calendar\/es|braft-finder\/dist|lodash|lodash-es|rc-tree\/es)[\\/]/,
    //           priority: -11,
    //         }
    //       }
    //     }
    //   };
    //   return config;
    // }
  },


}