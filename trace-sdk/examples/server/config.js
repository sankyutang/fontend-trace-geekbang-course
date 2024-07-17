const { resolve } = require('path')

const port = 2022
// const resolveDirname = (target) => resolve(__dirname, target)
// const JsFilePath = resolveDirname('../JS')
// const VueFilePath = resolveDirname('../Vue')
// const ReactFilePath = resolveDirname('../React')
// const Vue3FilePath = resolveDirname('../Vue3')
// const WebPerformancePath = resolveDirname('../WebPerformance')
// const browserDistFilePath = resolve('./packages/browser/dist')
// const webDistFilePath = resolve('./packages/web/dist')
// const vueDistFilePath = resolve('./packages/vue/dist')
// const reactDistFilePath = resolve('./packages/react/dist')
// const wxDistFilePath = resolve('./packages/wx-mini/dist')
// const webPerfFilePath = resolve('./packages/web-performance/dist')
const FilePaths = {
  '/js': resolve(__dirname, '../js'),
  // '/Vue': VueFilePath,
  // '/React': ReactFilePath,
  // '/Vue3': Vue3FilePath,
  // '/WebPerformance': WebPerformancePath,
  // '/browserDist': browserDistFilePath,
  // '/webDist': webDistFilePath,
  // '/vueDist': vueDistFilePath,
  // '/reactDist': reactDistFilePath,
  // '/wxDist': wxDistFilePath,
  // '/wpDist': webPerfFilePath
}

const ServerUrls = {
  normalGet: '/normal',
  exceptionGet: '/exception',
  normalPost: '/normal/post',
  exceptionPost: '/exception/post',
  errorsUpload: '/errors/upload'
}


exports.port = port
exports.FilePaths = FilePaths
exports.ServerUrls = ServerUrls
