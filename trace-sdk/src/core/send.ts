import { safeStringify } from "./util"

// 使用sendBeacon发送数据
export function sendBeacon(url: string, data: TraceData) {
  if (typeof navigator === 'undefined') return
  navigator.sendBeacon && navigator.sendBeacon(url, JSON.stringify(data))
}

// 使用img发送数据
export function sendByImg(url: string, data: TraceData) {

  const spliceStr = url.indexOf('?') === -1 ? '?' : '&'
  const imageUrl = `${url}${spliceStr}data=${encodeURIComponent(safeStringify(data))}`;
  let img = new Image()
  img.src = imageUrl
  img.onload = function() {
    console.log("Tracking data sent successfully!");
    img = null
  };
  img.onerror = function(err) {
    console.error("Failed to send tracking data.", err);
    img = null
  };
}

// 使用XMLHttpRequest发送数据
export function sendByXHR(url: string, data: TraceData) {
  const xhr = new XMLHttpRequest()
  xhr.open('get', url)
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
  xhr.withCredentials = true
  xhr.send(safeStringify(data))
}
