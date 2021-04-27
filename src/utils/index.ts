import {Config} from '../config'
import {randomString, parseHash, } from './tools'
import { GlobalVal } from '../config/global'

export function getCommonMsg() {
  let u = (navigator as any).connection
  let data: CommonMsg = {
    t: '', // 类型
    page: getPage(), // 页面地址 pathname
    times: 1,
    v: Config.appVersion, // 版本
    token: Config.token, // token，识别用户
    e: Config.environment, // 环境
    begin: new Date().getTime(), // 当前统计时间
    uid: getUid(), // 前端自动生成的UID，可以作为UV的识别
    sid: GlobalVal.sid,
    sr: screen.width + "x" + screen.height,
    vp: getScreen(),
    ct: u ? u.effectiveType : '',
    ul: getLang(),
    pkv: '{{VERSION}}',
    o: location.href,
  }
  return data
}

// 判断是否要发UV。一天内一个用户只发一次
export function isSendUv(): boolean {
  const uvTag = localStorage.getItem('webprode_uv_tag') || '';
  try {
    if (uvTag && new Date().toDateString() === new Date(+uvTag).toDateString()) {
      return false
    }
  } catch (error) {
  }
  localStorage.setItem('webprode_uv_tag', Date.now().toString());
  return true
}

// 获取页面
function getPage(): string {
  if (GlobalVal.page) return GlobalVal.page
  else {
    return location.pathname.toLowerCase()
  }
}

// 获取uid
function getUid(): string {
  let uid = localStorage.getItem('webprode_uid') || '';
  if (!uid) {
    uid = randomString();
    localStorage.setItem('webprode_uid', uid);
  }
  return uid;
}

// 获得sid
// TODO: 单页面
// function getSid() {
//   const date = new Date();
//   let sid = sessionStorage.getItem('webprode_sid') || '';
//   if (!sid) {
//       sid = randomString();
//       sessionStorage.setItem('webprode_sid', sid);
//   }
//   return sid;
// }

// 获取浏览器默认语言
function getLang() {
  var lang = navigator.language || (navigator as any).userLanguage; //常规浏览器语言和IE浏览器
  lang = lang.substr(0, 2); //截取lang前2位字符
  return lang
}

function getScreen() {
  let w = document.documentElement.clientWidth || document.body.clientWidth;
  let h = document.documentElement.clientHeight || document.body.clientHeight;
  return w + 'x' + h
}