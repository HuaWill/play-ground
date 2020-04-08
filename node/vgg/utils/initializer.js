const {loader} = require('./loader');

const initRouter = (app) => {
  const router = app.$router;
  
  return loader('../routes').then(routes => {
    routes.forEach(route => {
      let prefix = route[0] === 'index' ? '' : `/${route[0]}`;
      let routeConfig = typeof route[1] === 'function' ? route[1](app) : route[1];

      Object.keys(routeConfig).forEach(key => {
        const [method, path] = key.split(' ');
        console.log(`映射地址: ${method} ${prefix}${path}`);

        // 注册路由
        router[method](`${prefix}${path}`, async ctx => {
          app.ctx = ctx;
          await routeConfig[key](app);
        });
      });
    });
    // 添加router中间件
    return router;
  }).catch(err => {
    console.log(`init routes failed: ${err}`);
  });
}

const initServices = () => {
  const result = {};
  return loader('../services').then(services => {
    services.forEach(service => {
      result[service[0]] = service[1];
    });
    return result;
  }).catch(err => {
    console.log(`init services failed: ${err}`);
  });
}

const initCollections = () => {
  const result = {};
  return loader('../collections').then(collections => {
    collections.forEach(collection => {
      result[collection[0]] = collection[1];
    });
    return result;
  }).catch(err => {
    console.log(`init collections failed: ${err}`);
  });
}

const initModels = () => {
  const result = {};
  return loader('../models').then(models => {
    models.forEach(model => {
      result[model[0]] = model[1];
    });
    return result;
  }).catch(err => {
    console.log(`init models failed: ${err}`);
  });
}

module.exports = {
  initRouter,
  initServices,
  initCollections,
  initModels
}