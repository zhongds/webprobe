'use strict';

const Controller = require('egg').Controller;

class BombayController extends Controller {
  async index() {
    const { ctx } = this;
    const reqBody = ctx.request.body || '{}';
    ctx.logger.info('ctx.request.body', reqBody);
    ctx.logger.info('ctx.query', ctx.query);

    let data = [];
    try {
      const item = JSON.parse(reqBody);
      if (typeof item === 'object') {
        data = Array.isArray(item) ? [...item] : [item];
      }
    } catch (error) {
      ctx.logger.error('parse body error', error);
    }

    if (data.length === 0) {
      ctx.body = returnData(400, {requestBody: reqBody}, 'request body should be json/array');
      return;
    }
    ctx.logger.info('开始上报～～～～');

    try {
      const res = await Promise.all(data.map(c => ctx.service.uplog.pub({...c, ip: ctx.ip})));
      ctx.logger.info('结束上报～～～～');
      ctx.status = 200;
      ctx.body = returnData(200, {response: res.map(v => ({status: v.status, data: v.data}))});
    } catch (err) {
      const rid = Math.random().toString(36).substr(2) + '_' + Date.now();
      ctx.logger.error(`随机id: ${rid}, 上报错误`, err);
      ctx.status = 500;
      const msg = typeof err === 'object' ? `${err.name}: ${err.message}` : 'report error';
      ctx.body = returnData(500, {trackid: rid}, msg);
    }
  }
}

function returnData(code, data, msg) {
  return {
    resultCode: code,
    data,
    message: msg,
  }
}

module.exports = BombayController;
