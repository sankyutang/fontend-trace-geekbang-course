/** 接口 */

/** 数据类型 */

declare enum TraceTypes {
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

declare enum TraceClientTypes {
  // 安卓
  ANDROID_H5 = 'android',
  // iOS
  IOS_H5 = 'ios',
  // PC端
  PC_H5 = 'pc',
  // 浏览器
  BROWSER_H5 = 'browser'
}

declare enum BrowserType {
  // 手机端浏览器
  MOBILE = 'mobile',
  // PC浏览器
  PC = 'pc',
  // webview
  WEBVIEW = 'webview',
  // 小程序
  MINI_PROGRAM = 'miniProgram'
}

declare enum TraceLevelType {
  // 告警级别
  Error = 'error',
  // 预警级别
  Warn = 'warn',
  // 普通日志
  Info = 'info',
  // 调试日志
  Debug = 'debug'
}

declare enum TraceDataSeverity {
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

declare enum BreadcrumbTypes {
  ROUTE = 'Route',
  CLICK = 'UI.Click',
  CONSOLE = 'Console',
  FETCH = 'Fetch',
  UNHANDLEDREJECTION = 'Unhandledrejection',
  RESOURCE = 'Resource',
  CODE_ERROR = 'Code Error',
  CUSTOMER = 'Customer'
}

declare enum TraceDataTypes {
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

declare enum BreadcrumbsCategorys {
  Http = 'http',
  User = 'user',
  Debug = 'debug',
  Exception = 'exception',
  Lifecycle = 'lifecycle'
}

declare enum TraceBaseDataName {
  Fetch = 'Fetch',
  TypeError = 'TypeError',
  Unhandledrejection = 'Unhandledrejection',
  Log = 'Log',
  Perf = 'Perf',
  Resource = 'Resource'
}

/** 基类 */

// 全链路日志基类
type BaseTrace = {
  // 唯一ID，用户侧生成
  traceId: string
  // 日志类型
  type: TraceTypes
  // 日志产生时间
  createdAt: string
  // 日志最后更新时间
  updatedAt: string
};

// 浏览器相关字段基类
type BaseBrowserTrace = {
  // 当前浏览器的UserAgent
  ua: string
  // 浏览器类型
  bt: BrowserType
}

// 用户相关字段基类
type BaseUserTrace = {
  // 指纹ID，fingerprintId
  fpId: string
  // 用户ID
  uid?: string | number
  // 用户名称
  userName?: string
  // 用户邮箱
  email?: string
}

// 业务相关字段基类
type BaseAppTrace = {
  // 业务ID
  appId: string
  // 业务名称
  appName?: string
  // 客户端类型
  clientType: TraceClientTypes
  // 日志级别
  level: TraceLevelType
}

// 页面相关字段基类
type BasePageTrace = {
  // 页面ID
  pid: string
  // 页面标题
  title?: string
  // 当前页面URL
  url: string
}

type BaseTraceInfo = BaseTrace & BaseBrowserTrace & BaseUserTrace & BaseAppTrace & BasePageTrace

/** 以下是业务数据类型 */

// 行为日志
type TraceAction = {
  // 动作名称
  name: string
  // 动作参数
  level: TraceDataSeverity
  // 动作时间
  time: string
  // 日志类型
  type: BreadcrumbTypes
  // 行为分类
  category: BreadcrumbsCategorys
}

type TraceBaseData = {
  // id
  dataId: number
  // 日志信息名称
  name: string
  // name: TraceBaseDataName
  // 问题级别
  level: TraceDataSeverity
  // 异常信息
  message: string
  // 发生事件
  time: number
  // 日志类型
  type: TraceDataTypes
}

// 请求类信息
type TraceDataFetch = TraceBaseData & {
  // 执行时间，用于统计耗时
  elapsedTime: number
  // 请求方法
  method: 'POST' | 'GET'
  // 请求类型
  httpType: 'fetch' | 'xhr'
  // 请求地址
  url: string
  // 请求参数
  body: string
  // 响应状态
  status: number
}

// 代码异常错误信息
type TractDataCodeError = TraceBaseData & {
  stack: []
}

type TraceDataPromise = TraceBaseData

type TraceDataResource = TraceBaseData

// 普通日志
type TraceDataLog = TraceBaseData & {
  tag: string
}

type TraceDataPageView = TraceBaseData & {
  route: string
}

// webVitals性能收集信息对象
// type TracePerf = {
//   id: string
//   name: 'FCP' | 'CLS' | 'FID' | 'INP' | 'LCP' | 'TTFB'
//   value: number
//   delta: number
//   rating: string
// }

type TracePerf = {
  id: string
  LCP?: number
  LCPRating?: 'good' | 'needs improvement' | 'poor'
  FID?: number
  FIDRating?: 'good' | 'needs improvement' | 'poor'
  FCP?: number
  FCPRating?: 'good' | 'needs improvement' | 'poor'
  TTFB?: number
  TTFBRating?: 'good' | 'needs improvement' | 'poor'
  CLS?: number
  CLSRating?: 'good' | 'needs improvement' | 'poor'
  INP?: number
  INPRating?: 'good' | 'needs improvement' | 'poor'
  // cpus?: number
  // memory?: number
  // connection?: {
  //   rtt: number
  //   downlink: number
  //   effectiveType: 'slow-2g' | '2g' | '3g' | '4g'
  // }
}

// 一份错误信息的类型集合
type TraceTypeData = TraceDataFetch | TractDataCodeError | TraceDataPromise | TraceDataResource | TraceDataLog | TraceDataPageView

// 面包屑记录行为日志
type TraceBreadcrumbs = TraceAction[]

// 完整的全链路日志
type TraceData = BaseTraceInfo & {
  // 记录错误信息
  data?: TraceTypeData
  // 记录操作行为
  breadcrumbs?: TraceBreadcrumbs
  // 记录性能信息
  perf?: TracePerf[]
}
