import { BreadcrumbTypes, TraceDataSeverity, TraceDataTypes, BreadcrumbsCategorys, TraceLevelType, TraceTypes } from "../typings/common"

// 获取时间
export const getTimestamp = (): number => Date.now()


export const getFetchStatusLevel = (status: number): TraceDataSeverity => {
  if (status >= 500) {
    return TraceDataSeverity.Critical
  } else if (status >= 400) {
    return TraceDataSeverity.Error
  } else if (status >= 300) {
    return TraceDataSeverity.Warning
  } else if (status >= 200) {
    return TraceDataSeverity.Info
  } else {
    return TraceDataSeverity.Else
  }
}


export const isResourceTarget = (target: HTMLElement) =>
  target instanceof HTMLScriptElement ||
  target instanceof HTMLLinkElement ||
  target instanceof HTMLImageElement ||
  target instanceof HTMLVideoElement ||
  target instanceof HTMLAudioElement

  /**
 * 根据字符串生成hashcode
 *
 * @export
 * @param {string} str
 * @return {*}  {number} 可为正数和负数
 */
export function hashCode(str: string): number {
  let hash = 0
  if (str.length == 0) return hash
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return hash
}

export function dataTypes2BreadcrumbsType(data: TraceDataTypes) {
  switch (data) {
    case TraceDataTypes.JAVASCRIPT:
    case TraceDataTypes.UNKNOWN:
    case TraceDataTypes.UNKNOWN_FUNCTION:
    case TraceDataTypes.REACT:
    case TraceDataTypes.VUE:
      return BreadcrumbTypes.CODE_ERROR
    case TraceDataTypes.PROMISE:
      return BreadcrumbTypes.UNHANDLEDREJECTION
    case TraceDataTypes.HTTP:
      return BreadcrumbTypes.FETCH
    case TraceDataTypes.PERF:
    case TraceDataTypes.LOG:
      return BreadcrumbTypes.CONSOLE
    case TraceDataTypes.RESOURCE:
      return BreadcrumbTypes.RESOURCE
    case TraceDataTypes.ROUTE:
      return BreadcrumbTypes.ROUTE
    default:
      return BreadcrumbTypes.CUSTOMER
  }
}

export function dataCategory2BreadcrumbsCategory(data: TraceDataTypes) {
  switch (data) {
    case TraceDataTypes.JAVASCRIPT:
    case TraceDataTypes.UNKNOWN:
    case TraceDataTypes.UNKNOWN_FUNCTION:
      return BreadcrumbsCategorys.Exception
    case TraceDataTypes.REACT:
    case TraceDataTypes.VUE:
      return BreadcrumbsCategorys.Lifecycle
    case TraceDataTypes.PROMISE:
      return BreadcrumbsCategorys.Exception
    case TraceDataTypes.HTTP:
      return BreadcrumbsCategorys.Http
    case TraceDataTypes.PERF:
    case TraceDataTypes.LOG:
      return BreadcrumbsCategorys.Debug
    case TraceDataTypes.RESOURCE:
      return BreadcrumbsCategorys.Http
    case TraceDataTypes.ROUTE:
      return BreadcrumbsCategorys.Lifecycle
  }
}

export function getTraceDataLevel(level: TraceDataSeverity) {
  switch (level) {
    case TraceDataSeverity.High:
    case TraceDataSeverity.Critical:
    case TraceDataSeverity.Error:
      return TraceLevelType.Error
    case TraceDataSeverity.Warning:
      return TraceLevelType.Warn
    case TraceDataSeverity.Debug:
    case TraceDataSeverity.Low:
      return TraceLevelType.Debug
    default:
      return TraceLevelType.Info
  }
}

export function getTraceDataType(type: TraceDataTypes) {
  switch (type) {
    case TraceDataTypes.PROMISE:
    case TraceDataTypes.UNKNOWN:
    case TraceDataTypes.UNKNOWN_FUNCTION:
    case TraceDataTypes.JAVASCRIPT:
      return TraceTypes.CODE_ERROR
    case TraceDataTypes.REACT:
    case TraceDataTypes.VUE:
    case TraceDataTypes.ROUTE:
      return TraceTypes.EVENT
    case TraceDataTypes.PERF:
      return TraceTypes.PERF
    case TraceDataTypes.HTTP:
      return TraceTypes.FETCH
    case TraceDataTypes.RESOURCE:
      return TraceTypes.RESOURCE
    default:
      return TraceTypes.CUSTOMER
  }
}

export function getPerfLevel(data: TracePerf) {
  let level = TraceLevelType.Info
  if (data.LCPRating === 'poor'
      || data.FIDRating === 'poor'
      || data.FCPRating === 'poor'
      || data.TTFBRating === 'poor'
      || data.CLSRating === 'poor'
      || data.INPRating === 'poor'
  ) {
    // console.log('[getPerfLevel] error')
    level = TraceLevelType.Error
    return
  }
  if (
    data.LCPRating === 'needs improvement'
      || data.CLSRating === 'needs improvement'
      || data.FCPRating === 'needs improvement'
      || data.FIDRating === 'needs improvement'
      || data.INPRating === 'needs improvement'
      || data.TTFBRating === 'needs improvement'
  ) {
    // console.log('[getPerfLevel] warn')
    level = TraceLevelType.Warn
    return
  }
  return level
}

export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    /* tslint:disable */
    const r = (Math.random() * 16) | 0;
    /* tslint:disable */
    const v = c === 'x' ? r : (r & 0x3) | 0x8;

    return v.toString(16);
  });
}

export function safeStringify(obj: object): string {
  const set = new Set()
  const str = JSON.stringify(obj, function (_key, value) {
    if (set.has(value)) {
      return ''
    }
    typeof value === 'object' && set.add(value)
    return value
  })
  set.clear()
  return str
}
