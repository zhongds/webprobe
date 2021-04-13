const Service = require('egg').Service;

class Uplog extends Service {
  async pub(params) {
    this.ctx.logger.info('日志上报开始============', params);
    const topic = 'acc-webprode';
    const res = await this.ctx.curl(`http://172.30.30.100:4151/pub?topic=${topic}`, {
      method: 'POST',
      contentType: 'json',
      data: params,
    });
    this.ctx.logger.info('日志上报结果：', res);
    return res;
  }
}

module.exports = Uplog
