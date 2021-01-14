/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path')
const { getEntry, getMultiPageConf } = require('./src/lib/multi-page-config')

/* constant */
const outputDir = 'cookie-quick-copy' // 打包输出目录
const packagesOutputDir = 'cookie-quick-copy_packages' // zip&crx输出目录

/* 多页应用配置 自动按照getEntry入参划分 ** 详见getEntry&getMultiPageConf函数 ** */
const chromeScripts = getEntry('src/modules/*')
const pages = getMultiPageConf(chromeScripts, ['content'])

module.exports = {
  outputDir,
  assetsDir: 'assets',
  pages,
  productionSourceMap: false,
  css: {
    extract: {
      filename: 'css/[name].css'
    }
  },
  chainWebpack(config) {
    config
      .plugin('copy')
      .use('copy-webpack-plugin')
      .tap(args => {
        args.push({
          patterns: [
            {
              from: resolve('src/assets'),
              to: resolve(`${resolve(outputDir)}/assets`)
            },
            {
              from: resolve('src/config/manifest.json'),
              to: `${resolve(outputDir)}/manifest.json`
            },
            {
              from: resolve('src/config/inject.js'),
              to: resolve(`${resolve(outputDir)}/js`)
            }
          ]
        })
        return args
      })
    if (process.env.NODE_ENV === 'production') {
      config.output.filename('js/[name].js').end()
      config.output.chunkFilename('js/[name].js').end()
    }
    if (process.argv.includes('--zip')) {
      config
        .plugin('zip')
        .use('zip-webpack-plugin')
        .tap(args => {
          args.push({
            path: resolve(packagesOutputDir),
            filename: 'cookie-quick-copy.zip'
          })
          return args
        })
    }
    if (process.argv.includes('--crx')) {
      config
        .plugin('crx')
        .use('crx-webpack-plugin')
        .tap(args => {
          args.push({
            name: 'cookie-quick-copy',
            keyFile: resolve('src/config/cookie-quick-copy.pem'),
            contentPath: resolve(outputDir),
            outputPath: resolve(packagesOutputDir),
            updateUrl: '', // crx-webpack-plugin插件中的逻辑中必定会构建update.xml文件
            updateFilename: ''
          })
          return args
        })
    }
  },
  configureWebpack: {
    // entry: {
    //   content: './src/modules/content/main.js',
    //   background: './src/modules/background/main.js'
    // },
    output: {
      filename: 'js/[name].js'
    }
  }
}
