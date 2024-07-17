import { encode } from 'js-base64';
import { getTimestamp, uuid } from "./util";

const { fetch: originFetch } = window;

// 拦截fetch
// window.fetch = async (...args: any) => {
//   const [url, options] = args;

//   const res = await originFetch(url, options);

//   return res
// }

export type OnFetchError = {
  url: string
  status: number
  statusText: string
  method: 'POST' | 'GET'
  body: any,
  elapsedTime: number
}

export type OnBeforeProps = {
  url: string
  method: 'POST' | 'GET'
  options?: RequestInit
}

export type InterceptFetchType = {
  pagePath: string
  onError: (error: OnFetchError) => void;
  onBefore?: (props: OnBeforeProps) => void;
  onAfter?: (result: any) => void;
}

// 拦截fetch
const interceptFetch = ({
  pagePath,
  onError,
  onBefore,
  onAfter
}: InterceptFetchType) => {

  return async (...args: any) => {
    let [url, options] = args;
    const startTime = getTimestamp()

    const traceId = uuid();
    const traceSegmentId = uuid();
    const appId = uuid();
    const appVersion = 'v1.0.0'

    if (Object.prototype.toString.call(args[0]) === '[object Request]') {
      url = new URL(url.url);
    } else {
      if (args[0].startsWith('http://') || args[0].startsWith('https://')) {
        url = new URL(args[0]);
      } else if (args[0].startsWith('//')) {
        url = new URL(`${window.location.protocol}${args[0]}`);
      } else {
        url = new URL(window.location.href);
        url.pathname = args[0];
      }
    }

    const traceIdStr = String(encode(traceId));
    const segmentId = String(encode(traceSegmentId));
    const service = String(encode(appId));
    const instance = String(encode(appVersion));
    const endpoint = String(encode(pagePath));
    const peer = String(encode(url.host));
    const index = 1;
    const values = `${1}-${traceIdStr}-${segmentId}-${index}-${service}-${instance}-${endpoint}-${peer}`;

    if (!options) {
      options = {};
    }
    if (!options.headers) {
      options.headers = {};
    }
    options.headers['sw8'] = values;

    let res;
    try {
      onBefore && onBefore({
        url,
        method: options.method,
        options
      })
      res = await originFetch(url, options);

      onAfter && onAfter(res)
    } catch (err) {
      if (!!options.signal && err.name == 'AbortError') {
        onError({
          url,
          status: res.status,
          statusText: res.statusText,
          method: options.method,
          body: options.body,
          elapsedTime: getTimestamp() - startTime,
        })
      } else {
        throw err
      }
    }
    if (!(res.ok && res.status >= 200 && res.status < 300)) {
      onError({
        url,
        status: res.status,
        statusText: res.statusText,
        method: options.method,
        body: options.body,
        elapsedTime: getTimestamp() - startTime,
      })
    }

    return res
  }
}

export default interceptFetch
