const koa = require('koa');
const Router = require('koa-router')
const {initRouter} = require('./utils/initializer');

class VGG {
  constructor() {
    this.$app = new koa();
    this.$router = new Router();
    initRouter(this);
  }

  start(port) {
    this.$app.listen(port, () => {
      console.log(`服务器启动，端口${port}`);
    });
  }
}

module.exports = VGG;
