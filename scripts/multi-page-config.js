/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const glob = require('glob')

/**
 * 读取 src/modules 中所有模块
 *
 * @param {array | string} globPath
 * @return {object}
 */
exports.getEntry = function(globPath) {
  const entries = {}
  if (typeof globPath !== 'object') {
    globPath = [globPath]
  }
  globPath.forEach(item => {
    glob.sync(item).forEach(function(file) {
      // console.log('文件路径', file)
      const fileExtension = path.extname(file) // 文件后缀
      // console.log('主文件后缀', fileExtension)
      const fileName = path.basename(file, fileExtension) // 主文件名
      // console.log('主文件名', fileName)
      entries[fileName] = file
    })
  })
  return entries
}

/**
 *生成pages多入口配置文件
 *
 * @param {object} modules
 * @param {array} [exclude=[]]
 * @return {*}
 */
exports.getMultiPageConf = function(modules, exclude = []) {
  exclude.forEach(item => {
    delete modules[item]
  })
  const config = {}
  for (const moduleItem in modules) {
    const modulePath = modules[moduleItem]
    const itemConf = {
      entry: `${modulePath}/main.ts`, // 配置入口js文件
      template: `${modulePath}/index.html`, // 主页面
      filename: `${moduleItem}.html` // 打包后的html文件名称
    }
    config[moduleItem] = itemConf
  }
  return config
}
