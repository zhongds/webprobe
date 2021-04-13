'use strict';

const Controller = require('egg').Controller;

class BombayController extends Controller {
  async index() {
    const { ctx } = this;
    const reqBody = ctx.request.body || {};
    ctx.logger.info('ctx.request.body', reqBody);
    ctx.logger.info('ctx.query', ctx.query);
    // 打印请求参数
    const data = {
      resultCode: 200,
      data: {
        requestQuery: ctx.query,
        requestBody: ctx.get('Content-Type') === 'text/plain' ? JSON.parse(ctx.request.body) : reqBody,
      },
      message: 'success',
    };
    ctx.logger.info('开始上报～～～～');
    const res = await ctx.service.uplog.pub(data);
    ctx.logger.info('结束上报～～～～');
    ctx.status = res.status;
    ctx.set(res.headers);
    ctx.body = res.data;
  }
}

module.exports = BombayController;
