const {loader} = require('./loader');

const initRouter = (app) => {
  const router = app.$router;
  
  return loader('../routes').then(routes => {
    let prefix = "";
    let config = null;

    routes.forEach(route => {
      prefix = route[0] === 'index' ? '' : `/${route[0]}`;
      config = typeof route[1] === 'function' ? route[1](app) : route[1];

      Object.keys(config).forEach(key => {
        const [method, path] = key.split(' ');
        console.log(`映射地址: ${method} ${prefix}${path}`);
        // 注册路由
        router[method](`${prefix}${path}`, async ctx => {
          console.log('request url:::', ctx.request.url);
          console.log('matched handler:::', config[key]);
          app.ctx = ctx;
          await config[key](app);
        });
      });
    });
    // 添加router中间件
    app.$app.use(router.routes());
  }).catch(err => {
    console.log(`init routes failed: ${err}`);
  });
}

module.exports = {
  initRouter
}