// const instance = MITO.init({
//   // disabled: false,
//   debug: true,
//   service: 'wonder-h5',
//   silentConsole: true,
//   silentXhr: false,
//   maxBreadcrumbs: 100,
//   // dsn: 'http://localhost:2021/errors/upload',
//   dsn: 'http://reporter-fat.61info.cn/o/v1/upload',
//   // dsn: 'http://10.200.13.245:8111/o/v1/upload',
//   throttleDelayTime: 0,
//   // enableTraceId: false,
//   useImgUpload: false,
//   bizInfo: {
//     appName: 'weixin',
//     qrcode: '!@#$%5'
//   },
//   // webPerformance: true,
//   configReportXhr(xhr, reportData) {
//     // xhr.setRequestHeader('mito-header', 'test123')
//   }
// })
// window._MITO_ = instance
// const init = require('../dist/lib/trace-sdk').default

const instance = window.traceSdkInit({
  dsn: 'http://localhost:2022/track.gif',
  appId: 'fontend-trace-geekbang-course'
})

instance.setUserId('1000')
