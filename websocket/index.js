const {Server: WebSocketServer} = require("ws");
const wss = new WebSocketServer({port: 10086});
wss.on('connection', (ws) => {
  console.log('Client Connected ...');
  ws.on('message', (msg) => {
    console.log(msg);
  });
});
