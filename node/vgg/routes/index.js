module.exports = app => {
  const service = app.$services.index(app);

  return {
    "get /collection": async app => {
      console.log('/collection');
      app.ctx.body = await service.getCollection();
    },
    "get /model": async app => {
      console.log('/model');
      app.ctx.body = await service.getModel();
    }
  }
}