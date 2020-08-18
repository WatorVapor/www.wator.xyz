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
    ws.isAlive = false;
    ws.ping(noop);
  });  
};
const interval = setInterval(doPingWS, 10000);

const EDAuth = require('./edauth.js');
const auth = new EDAuth();


const onWSMsg = (message,ws) => {
  try {
    const jsonMsg = JSON.parse(message);
    const goodAuth = auth.verify(jsonMsg);
    if(goodAuth) {
      onGoodAuthMsg(jsonMsg,ws);
    } else {
      console.log('onWSMsg: goodAuth=<', goodAuth,'>');
      console.log('onWSMsg: jsonMsg=<', jsonMsg,'>');
    }
  } catch(e) {
    console.log('onWSMsg: message=<', message,'>');
    console.log('onWSMsg: e=<', e,'>');    
  }
};


const MongoStorage = require('./storage.js');
const mongo = new MongoStorage();

const onGoodAuthMsg = (jsonMsg,ws) => {
  //console.log('onGoodAuthMsg: jsonMsg=<', jsonMsg,'>');
  if(jsonMsg.payload) {
    const payload = jsonMsg.payload;
    if(payload.act === 'signup') {
      mongo.saveSignup(jsonMsg);
    } else if(payload.act === 'signin') {
      mongo.saveSignin(jsonMsg);
      mongo.fetchToken(jsonMsg.token,(profile)=> {
       onGoodAccount(profile,ws);
      });
    } else {
      console.log('onGoodAuthMsg: payload=<', payload,'>');
    }
  } else {
    console.log('onGoodAuthMsg: jsonMsg=<', jsonMsg,'>');
  }
}
const onGoodAccount = (profile,ws) => {
  //console.log('onGoodAccount: profile=<', profile,'>');
  if(profile) {
    ws.send(JSON.stringify(profile));
  } else {
    ws.send(JSON.stringify({payload:{act: 'signup',failure:true}}));
  }
}