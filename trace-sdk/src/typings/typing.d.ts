/** 接口 */
import {
  TraceTypes,
  BrowserType,
  TraceClientTypes,
  TraceLevelType,
  TraceDataTypes,
  BreadcrumbTypes,
  BreadcrumbsCategorys,
  TraceBaseDataName,
} from '../typings/common'
/** 数据类型 */

/** 基类 */

declare global {

  // 全链路日志基类
  type BaseTrace = {
    // 唯一ID，用户侧生成
    traceId: string
    // 日志类型
    type: TraceTypes
    // 日志产生时间
    createdAt: number
    // 日志最后更新时间
    updatedAt: number
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

  type TraceBaseAction = {
    // 动作名称
    name: string
    // 动作参数
    level: TraceDataSeverity
    // 动作时间
    time: number
    // 日志类型
    type: BreadcrumbTypes
    // 行为分类
    category: BreadcrumbsCategorys
  }

  // 行为日志
  type TraceAction = TraceBaseAction & {
    // 行为动作相关的信息，可以是DOM，可以是错误信息，可以是自定义信息
    message?: string
    // 请求参数
    request?: any
    // 请求结果内容
    response?: any
    // 错误堆栈信息
    stack?: string
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
    stack: string
  }

  type TraceDataPromise = TraceBaseData

  type TraceDataResource = TraceBaseData & {
    url?: string
  }

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

  type TracePerfRating = 'good' | 'needs improvement' | 'poor'

  type TracePerf = {
    id: string
    LCP?: number
    LCPRating?: TracePerfRating
    FID?: number
    FIDRating?: TracePerfRating
    FCP?: number
    FCPRating?: TracePerfRating
    TTFB?: number
    TTFBRating?: TracePerfRating
    CLS?: number
    CLSRating?: TracePerfRating
    INP?: number
    INPRating?: TracePerfRating
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
    perf?: TracePerf
  }
}
