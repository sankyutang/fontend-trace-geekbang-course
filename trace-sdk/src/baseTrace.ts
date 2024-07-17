
import { BaseTraceInterface } from './core/interface';
import { onVitals, mapMetric, generateUniqueId } from './core/webvitals';
import interceptFetch, { OnBeforeProps, OnFetchError } from './core/fetch';
import { dataCategory2BreadcrumbsCategory, dataTypes2BreadcrumbsType, getPerfLevel, getTimestamp, getTraceDataLevel, getTraceDataType, hashCode, isResourceTarget, uuid } from './core/util';
import { BreadcrumbTypes, BreadcrumbsCategorys, BrowserType, TraceClientTypes, TraceDataSeverity, TraceDataTypes, TraceLevelType, TraceTypes } from './typings/common'
import { getFingerprintId } from './core/fingerprint';
import { sendByImg } from './core/send';

export interface TraceOptions {
  perfOnSend: () => void;
  perfBeforeSend: () => void;
  dsn: string
  debug?: boolean
  appId: string
}

export class BaseTrace implements BaseTraceInterface {

  // 日志上报后端API
  public dsn: string = ''
  // 页面ID
  public pageId: string = ''
  //
  public userAgent = navigator.userAgent
  //
  public browserType = BrowserType.MOBILE
  // fingerprintId
  public fpId = ''
  // user id
  public uid = ''
  // appId
  public appId = ''

  // 是否开启debug状态
  public debug = true;

  // 性能日志数据
  public perfData: TracePerf = {
    id: ''
  }

  // 存储错误资源数据
  public resources: TraceDataResource[] = []

  public result = {}

  // 记录用户行为
  public breadcrumb: TraceBreadcrumbs = []

  // 最大存储用户行为
  public maxBreadcrumb = 10

  // 是否开启用户行为
  public breadcrumbEnabled = true

  public observer = null

  // 存储链路日志数据
  public queue: TraceData[] = []

  // 发送请求时间间隔
  public sendTimer = 1000

  public constructor(options: TraceOptions) {
    console.log('BaseTrace constructor.')
    this.pageId = uuid()
    this.dsn = options.dsn
    this.appId = options.appId
    this.debug = !!options.debug
    this.perfData = {
      id: generateUniqueId()
    }
    this.fpId = getFingerprintId('TraceCourse')

    this.observer = new PerformanceObserver((list, observer) => {
      list.getEntries().forEach((entry) => {
        this.debug && console.debug(`name    : ${entry.name}`);
        this.debug && console.debug(`type    : ${entry.entryType}`);
        this.debug && console.debug(`duration: ${entry.duration}`);
        if (entry.entryType === 'resource') {
          this.handleObserverResource(entry as PerformanceResourceTiming)
        }
      });
    });
  }



  public log(log: TraceDataLog) {
    this.saveBreadcrumb({
      name: 'customer-log',
      level: log.level,
      type: dataTypes2BreadcrumbsType(log.type),
      category: dataCategory2BreadcrumbsCategory(log.type),
      message: log.message,
      time: getTimestamp(),
    })
    this.debug && console.debug(`log: ${JSON.stringify(log)}`);
    this.send(log)
  }

  public info(message: string, tag?: string) {
    this.log({
      name: 'customer-info',
      type: TraceDataTypes.LOG,
      level: TraceDataSeverity.Info,
      message,
      time: getTimestamp(),
      dataId: hashCode(`${message}|${tag || ''}`),
      tag,
    })
  }

  public warn(message: string, tag?: string) {
    this.log({
      name: 'customer-warning',
      type: TraceDataTypes.LOG,
      level: TraceDataSeverity.Warning,
      message,
      time: getTimestamp(),
      dataId: hashCode(`${message}|${tag || ''}`),
      tag,
    })
  }

  public error(message: string, tag?: string) {
    this.log({
      name: 'customer-error',
      type: TraceDataTypes.LOG,
      level: TraceDataSeverity.Error,
      message,
      time: getTimestamp(),
      dataId: hashCode(`${message}|${tag || ''}`),
      tag,
    })
  }

  public setTraceData(data: TraceTypeData | TracePerf) {
    let type = TraceTypes.CONSOLE
    let level = TraceLevelType.Debug
    let _data = null
    let perf = null

    if (!!(data as TraceTypeData).dataId) {
      type = getTraceDataType((data as TraceTypeData).type)
      level = getTraceDataLevel((data as TraceTypeData).level)
      _data = data as TraceTypeData
    }
    if (!!(data as TracePerf).id) {
      type = TraceTypes.PERF
      level = getPerfLevel(data as TracePerf)
      perf = data as TracePerf
    }

    const traceData: TraceData = {
      type,
      level,
      createdAt: getTimestamp(),
      updatedAt: getTimestamp(),
      data: _data,
      perf,
      breadcrumbs: this.breadcrumb,
      traceId: uuid(),
      ua: this.userAgent,
      bt: this.browserType,
      fpId: this.fpId,
      appId: this.appId,
      clientType: TraceClientTypes.BROWSER_H5,
      url: document.URL,
      pid: this.pageId,
      uid: this.uid,
    }
    this.debug && console.log('[setTraceData]traceData: ',traceData)
    return traceData
  }

  public send(data: TraceTypeData | TracePerf) {
    const traceData = this.setTraceData(data)
    sendByImg(this.dsn, traceData)
  }

  createPerfReport() {
    const report = (metric) => {
      this.perfData = { ...this.perfData, ...mapMetric(metric) };
    };

    setTimeout(() => {
      const supportedEntryTypes = (PerformanceObserver && PerformanceObserver.supportedEntryTypes) || []
      const isLatestVisibilityChangeSupported = supportedEntryTypes.indexOf('layout-shift') !== -1

      if (isLatestVisibilityChangeSupported) {
        const onVisibilityChange = () => {
          if (document.visibilityState === 'hidden') {
            console.log('this.send', this.perfData)
            this.send(this.perfData)
            // removeEventListener('visibilitychange', onVisibilityChange, true)
          }
        }
        addEventListener('visibilitychange', onVisibilityChange, true)
      } else {
        addEventListener('pagehide', () => {
          console.log('pagehide', this.perfData)
          this.send(this.perfData)
        }, { capture: true, once: true })
      }
    })

    return report
  }

  public saveError(event: ErrorEvent) {
    console.log('[onResourceError] event: ', event)
    const target = event.target || event.srcElement;
    const isResTarget = isResourceTarget(target as HTMLElement);

    if (!isResTarget) {
      const traceData: TraceTypeData = {
        dataId: hashCode(`${event.type}-${event.error.stack}`),
        name: 'script-error',
        level: TraceDataSeverity.Error,
        message: event.message,
        time: getTimestamp(),
        type: TraceDataTypes.JAVASCRIPT,
        stack: event.error.stack
      }
      this.resources.push(traceData)
      this.breadcrumb.push({
        name: event.error.name,
        type: BreadcrumbTypes.CODE_ERROR,
        category: BreadcrumbsCategorys.Exception,
        level: TraceDataSeverity.Error,
        message: event.message,
        stack: event.error.stack,
        time: getTimestamp()
      })
      this.queue.push(this.setTraceData(traceData))
    } else {
      const url = (target as HTMLElement).getAttribute('src') || (target as HTMLElement).getAttribute('href')
      const traceData: TraceTypeData = {
        dataId: hashCode(`${(target as HTMLElement).nodeName.toLowerCase()}-${event.message}${url}`),
        name: 'resource-load-error',
        level: TraceDataSeverity.Warning,
        message: event.message,
        time: getTimestamp(),
        type: TraceDataTypes.RESOURCE,
        stack: null
      }
      this.resources.push(traceData)
      this.breadcrumb.push({
        name: traceData.name,
        type: BreadcrumbTypes.RESOURCE,
        category: BreadcrumbsCategorys.Exception,
        level: TraceDataSeverity.Warning,
        message: event.message,
        time: getTimestamp()
      })
      this.queue.push(this.setTraceData(traceData))
    }

  }

  public handleObserverResource(entry: PerformanceResourceTiming) {
    if (entry.entryType === 'resource') {
      let level = TraceDataSeverity.Info
      if (entry.duration > 1000 && entry.duration < 1500) {
        level = TraceDataSeverity.Warning
      } else  if (entry.duration > 1500) {
        level = TraceDataSeverity.Error
      }
      entry.duration > 1000 && this.resources.push({
        url: entry.name,
        name: `${entry.entryType}-duration-${entry.initiatorType}`,
        type: TraceDataTypes.PERF,
        level,
        message: `duration:${Math.round(entry.duration)}`,
        time: getTimestamp(),
        dataId: hashCode(`${entry.entryType}-${entry.name}`),
      })
    }
  }

  // 这里的构造数据有问题，后续需要更新
  public onFetchError(message: OnFetchError) {
    console.log('[onFetchError] message: ', message)
    const traceBaseData: TraceBaseData = {
      dataId: hashCode(`${message.url}-${message.method}-${message.status}-${message.statusText}`),
      name: 'fetch-error',
      level: TraceDataSeverity.Critical,
      message: '',
      time: getTimestamp(),
      type: TraceDataTypes.HTTP
    }
    const errorData: TraceDataFetch = {
      ...traceBaseData,
      url: message.url,
      status: message.status,
      message: message.statusText,
      method: message.method,
      body: message.body,
      elapsedTime: message.elapsedTime,
      httpType: 'fetch'
    }
    console.log('error data: ', errorData)
    this.queue.push(this.setTraceData(errorData))
  }

  public onGlobalError() {
    const _t = this
    console.log('onGlobalError')
    window.addEventListener('error', (event) => {
      _t.saveError(event)
    })
    window.addEventListener('unhandledrejection', (event: any) => {
      // _t.saveError(event)
      console.log(event)
      if (event instanceof PromiseRejectionEvent) {
        const errorEvent = new ErrorEvent("promiseRejection", {
          message: event.reason.toString(),
          // filename: event.filename,
          // lineno: event.lineno,
          // colno: event.colno,
          error: event.reason,
        });
        _t.saveError(errorEvent);
      } else if (event instanceof ErrorEvent) {
        _t.saveError(event);
      }
    })
  }

  public onGlobalClick() {
    const _t = this
    window.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      const innerHTML = target.innerHTML
      const bc: TraceAction = {
        name: 'click',
        level: TraceDataSeverity.Normal,
        type: BreadcrumbTypes.CLICK,
        category: BreadcrumbsCategorys.User,
        message: innerHTML,
        time: getTimestamp()
      }
      this.saveBreadcrumb(bc)
    })
  }

  public onObserverResource() {
    const _t = this
    // const observer = new PerformanceObserver((list, observer) => {
    //   list.getEntries().forEach((entry) => {
    //     console.log(`name    : ${entry.name}`);
    //     console.log(`type    : ${entry.entryType}`);
    //     console.log(`duration: ${entry.duration}`);
    //     _t.handleObserverResource(entry)
    //   });
    // });
    // observer.observe({
    //   entryTypes: ["resource"],
    // });
  }

  public saveBreadcrumb(data: TraceAction) {
    if (this.breadcrumbEnabled) {
      this.breadcrumb.push(data)
      if (this.breadcrumb.length > this.maxBreadcrumb) {
        this.breadcrumb.shift()
      }
    }
  }

  public setUserId(userId: string) {
    this.uid = userId
  }

  // 初始化实例
  public static init(options: TraceOptions): BaseTrace {
    const traceSdk = new BaseTrace(options)

    traceSdk.onGlobalError()
    // traceSdk.onObserverResource()
    traceSdk.observer.observe({
      entryTypes: ["resource"],
    });

    window.fetch = interceptFetch({
      pagePath: '',
      onError: (error) => {
        traceSdk.onFetchError(error)
      },
      onBefore: (props: OnBeforeProps) => {
        traceSdk.saveBreadcrumb({
          name: 'fetch',
          level: TraceDataSeverity.Normal,
          type: BreadcrumbTypes.FETCH,
          category: BreadcrumbsCategorys.Http,
          message: props.url,
          time: getTimestamp(),
          request: {
            method: props.method,
            url: props.url,
            options: props.options
          }
        })
      },
      onAfter: (result: any) => {
        traceSdk.saveBreadcrumb({
          name: 'fetch',
          level: TraceDataSeverity.Normal,
          type: BreadcrumbTypes.FETCH,
          category: BreadcrumbsCategorys.Http,
          message: result.status,
          time: getTimestamp(),
          response: {
            status: result.status,
            statusText: result.statusText
          }
        })
      }
    })

    // 监听页面性能
    onVitals(traceSdk.createPerfReport())

    setInterval(() => {
      console.log('[queue] traceSdk.queue: ', traceSdk.queue)
      const data = traceSdk.queue.shift()
      console.log('[queue] data: ', data)
      if (data) sendByImg(traceSdk.dsn, data)
    }, traceSdk.sendTimer)

    // @ts-ignore
    window.traceSdk = traceSdk
    return traceSdk
  }
}
