'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'Vue e-commerce admin'

const port = process.env.port || process.env.npm_config_port || 8975

module.exports = {
  /**
     * 如果您计划在子路径下部署站点，则需要设置publicPath，
     * 例如GitHub页面。如果您计划将您的站点部署到https://test.github.io/bar/，
     * 然后将publicPath设置为“/bar/”。
     * 在大多数情况下，请使用'/' !!!
     * 细节可见: https://cli.vuejs.org/config/#publicpath
     *
     */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    }
    // before: require()
  },
  configureWebpack: {
    /**
         * 在webpack的name字段中提供应用程序的标题，以便
         * 可以在index.html中访问它来插入正确的标题。
         */
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    // config
    //   .plugin('webpack-bundle-analyzer')
    //   .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)

    // 设置 svg-sprite-loader
    // config.module
    //     .rule('svg')
    //     .exclude.add(resolve('src/icons'))
    //     .end()
    // config.module
    //     .rule('icons')
    //     .test(/\.svg$/)
    //     .include.add(resolve('src/icons'))
    //     .end()
    //     .use('svg-sprite-loader')
    //     .loader('svg-sprite-loader')
    //     .options({
    //         symbolId: 'icon-[name]'
    //     })
    //     .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()
    config
    // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )
    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // 最初依赖的第三方包
                },
                elementUI: {
                  name: 'chunk-elementUI', // 将elementUI拆分成一个包
                  priority: 20, // 体积需要大于libs和app，否则会被打包成libs或app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // 以适应cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // 可以自定义规则
                  minChunks: 3, //  最小数量
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  }

}
