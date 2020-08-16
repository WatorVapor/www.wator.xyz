const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const { execSync } = require('child_process')

const socketPath = '/tmp/wator/wss.wator.xyz' ;
fs.existsSync(socketPath) && fs.unlinkSync(socketPath);
const hs = http.createServer();
const wss = new WebSocket.Server({server: hs});
hs.listen(socketPath, () => {
  console.log('hs.listen:socketPath=<',socketPath,'>');
  execSync(`chmod 777 ${socketPath}`);
});
wss.on('connection', (ws) => {
  onConnected(ws);
});

const onConnected = (ws) => {
  ws.on('message', (message) => {
    onWSMsg(message,ws);
  });
  ws.on('error', (evt) => {
    console.log('error: evt=<', evt,'>');
  });
  ws.isAlive = true;
  ws.on('pong', heartBeatWS);  
}
const noop = () => {};
const heartBeatWS = () => {
  console.log('heartBeatWS::this=<',this,'>');
  this.isAlive = true;
}
const doPingWS = () => {
  wss.clients.forEach((ws) => {
    /*
    if (ws.isAlive === false) {
      console.log('heartBeatWS::ws.isAlive=<',ws.isAlive,'>');
      return ws.terminate();
    }
    */
    ws.isAlive = false;
    ws.ping(noop);
  });  
};
const interval = setInterval(doPingWS, 10000);

const onWSMsg = (message,ws) => {
  console.log('onWSMsg: message=<', message,'>');
  try {
    const jsonMsg = JSON.parse(message);
    if(jsonMsg) {
    }
  } catch(e) {
    
  }
};
