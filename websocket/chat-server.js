const {Server: WebSocketServer} = require("ws");
const uuid = require("node-uuid");

const wss = new WebSocketServer({port: 10086});

const wsContainer = {};

wss.on('connection', (ws) => {
  let clientId = uuid.v4();
  wsContainer[clientId] = ws;

  ws.send(JSON.stringify({
    clientId: clientId.split("-")[0]
  }));

  ws.on('message', (msg) => {
    Object.keys(wsContainer).forEach(id => {
      wsContainer[id].send(JSON.stringify({
        client: clientId.split("-")[0],
        msg: msg
      }));
    });
  });

  ws.on('close', () => {
    console.log(clientId, ': 1connection closed !!!');
    delete wsContainer[clientId];
  })

  console.log(clientId, ': connection established !!!');
});
