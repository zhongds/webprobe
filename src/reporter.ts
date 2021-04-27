
import { Config, } from './config'
import { GlobalVal, resetGlobalCacheReports } from './config/global';
import { queryString, serialize, warn } from './utils/tools'

// 上报
export function report(e: ReportData) {
  "res" === e.t ? 
    send(e) 
      : "error" === e.t ? send(e) 
      : "behavior" === e.t ? send(e) 
      : "health" === e.t && window && window.navigator && "function" == typeof window.navigator.sendBeacon ? sendBeacon(e) 
      : send(e);
  return;
}

// post上报
export function send(msg: ReportData) {
  GlobalVal.cacheReports.push(msg);
  if ('complete' !== window.document.readyState) {
    return;
  }
  // 延时500毫秒 上报
  setTimeout(() => {
    if (GlobalVal.cacheReports.length > 0) {
      var url = Config.reportUrl;
      post(url, GlobalVal.cacheReports);
      resetGlobalCacheReports();
    }
  }, 500);
  // new Image().src = `${Config.reportUrl}?${serialize(msg)}`
}

export function post(url, body) {
  var XMLHttpRequest = window.__oXMLHttpRequest_ || window.XMLHttpRequest;
  if (typeof XMLHttpRequest === 'function') {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", url, !0)
      xhr.setRequestHeader("Content-Type", "text/plain")
      xhr.send(JSON.stringify(body))
    } catch (e) {
      warn('[bombayjs] Failed to log, POST请求失败')
    }
  } else {
    warn('[bombayjs] Failed to log, 浏览器不支持XMLHttpRequest')
  }
}

// 健康检查上报
export function sendBeacon(e: ReportData) {
  window && window.navigator && "function" == typeof window.navigator.sendBeacon 
    ? window.navigator.sendBeacon(Config.reportUrl, JSON.stringify(e)) 
    : warn("[arms] navigator.sendBeacon not surported")
}