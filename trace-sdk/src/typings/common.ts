export enum TraceDataSeverity {
  // 其他
  Else = 'else',
  // 错误级别
  Error = 'error',
  // 告警级别
  Warning = 'warning',
  // 日志级别
  Info = 'info',
  // 调试级别
  Debug = 'debug',
  /** 上报的错误等级 */
  // 低危级别
  Low = 'low',
  // 普通级别
  Normal = 'normal',
  // 高危级别
  High = 'high',
  // 极其严重
  Critical = 'critical'
}

export enum TraceTypes {
  // PVUV
  PAGE_VIEW = 'PageView',
  // Event
  EVENT = 'EVENT',
  // 性能
  PERF = 'Perf',
  // 资源
  RESOURCE = 'Resource',
  // 动作、行为类型
  ACTION = 'Action',
  // 请求类型
  FETCH = 'Fetch',
  // 代码错误
  CODE_ERROR = 'CodeError',
  // 日志
  CONSOLE = 'Console',
  // 其它
  CUSTOMER = 'Customer'
}

export enum TraceClientTypes {
  // 安卓
  ANDROID_H5 = 'android',
  // iOS
  IOS_H5 = 'ios',
  // PC端
  PC_H5 = 'pc',
  // 浏览器
  BROWSER_H5 = 'browser'
}

export enum BrowserType {
  // 手机端浏览器
  MOBILE = 'mobile',
  // PC浏览器
  PC = 'pc',
  // webview
  WEBVIEW = 'webview',
  // 小程序
  MINI_PROGRAM = 'miniProgram'
}

export enum TraceLevelType {
  // 告警级别
  Error = 'error',
  // 预警级别
  Warn = 'warn',
  // 普通日志
  Info = 'info',
  // 调试日志
  Debug = 'debug'
}

export enum BreadcrumbTypes {
  ROUTE = 'Route',
  CLICK = 'UI.Click',
  CONSOLE = 'Console',
  FETCH = 'Fetch',
  UNHANDLEDREJECTION = 'Unhandledrejection',
  RESOURCE = 'Resource',
  CODE_ERROR = 'Code Error',
  CUSTOMER = 'Customer'
}

export enum TraceDataTypes {
  UNKNOWN = 'UNKNOWN',
  UNKNOWN_FUNCTION = 'UNKNOWN_FUNCTION',
  JAVASCRIPT = 'JAVASCRIPT',
  LOG = 'LOG',
  HTTP = 'HTTP',
  VUE = 'VUE',
  REACT = 'REACT',
  RESOURCE = 'RESOURCE',
  PROMISE = 'PROMISE',
  ROUTE = 'ROUTE',
  PERF = 'PERF'
}

export enum BreadcrumbsCategorys {
  Http = 'http',
  User = 'user',
  Debug = 'debug',
  Exception = 'exception',
  Lifecycle = 'lifecycle'
}

export enum TraceBaseDataName {
  Fetch = 'Fetch',
  TypeError = 'TypeError',
  Unhandledrejection = 'Unhandledrejection',
  Log = 'Log',
  Perf = 'Perf',
  Resource = 'Resource'
}
