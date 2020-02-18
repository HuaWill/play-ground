const {Server: WebSocketServer} = require("ws");

const stocks = {
  '白酒': 100,
  '科技': 80,
  '医药': 70,
  '银行': 95,
  '债券': 120
}

function randomInterval (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function randomStockUpdater (stocks) {
  Object.keys(stocks).forEach(name => {
    let floatChange = randomInterval(-30, 30);
    stocks[name] += floatChange;
  });
}

const wss = new WebSocketServer({port: 10086});
let stockUpdateHandler;

wss.on('connection', (ws) => {

  let copy = Object.assign({}, stocks);

  stockUpdateHandler = setInterval(() => {
    randomStockUpdater(copy);
    ws.send(JSON.stringify(Object.assign({}, copy)));
  }, 1500);

  ws.send(JSON.stringify(Object.assign({}, copy)));

  ws.on('message', (msg) => {
    console.log(msg);
  });

  ws.on('close', () => {
    clearInterval(stockUpdateHandler);
    console.log('Connection closed ...');
  });
});
