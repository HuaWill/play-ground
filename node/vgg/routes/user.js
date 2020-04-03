module.exports = {
  "get /": async app => {
    // console.log('/user')
    app.ctx.body = '用户首页'
  },
  "get /info": async app => {
    // console.log('/user/info')
    app.ctx.body = '用户信息页'
  }
}
