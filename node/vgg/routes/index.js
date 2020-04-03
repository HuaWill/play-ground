module.exports = app => {
  return {
    "get /": async app => {
      app.ctx.body = '首页'
    }
  }
}