const koa = require('koa');
const Router = require('koa-router');
const cors = require('koa-cors');
const bodyParser = require('koa-bodyparser');
const {initRouter, initServices, initCollections, initModels} = require('./utils/initializer');


class VGG {
  constructor() {
    this.$app = new koa();
    this.$router = new Router({prefix: '/shape'});

    initServices().then(services => {
      this.$services = services;
    });

    initCollections().then(collections => {
      this.$collections = collections;
    });

    initModels().then(models => {
      this.$models = models;
    });

    initRouter(this).then(router => {
      this.$app.use(router.routes());
    });

    this.$app.use(cors());
    this.$app.use(bodyParser());
  }

  start(port) {
    this.$app.listen(port, () => {
      console.log(`服务器启动，端口${port}`);
    });
  }
}

module.exports = VGG;
