const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const { execSync } = require('child_process')

const socketPath = '/dev/shm/wss.api.wator.xyz' ;
fs.existsSync(socketPath) && fs.unlinkSync(socketPath);
const hs = http.createServer();
hs.listen(socketPath, () => {
  console.log('hs.listen:socketPath=<',socketPath,'>');
  execSync(`chmod 777 ${socketPath}`);
});

const wss = new WebSocket.Server({server: hs});
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

const onGoodAuthMsg = (jsonMsg,ws) => {
  //console.log('onGoodAuthMsg: jsonMsg=<', jsonMsg,'>');
  const Routes = require('./route.js');
  //console.log('onGoodAuthMsg: Routes=<', Routes,'>');
  try {
    for(const route of Routes) {
      //console.log('onGoodAuthMsg: route=<', route,'>');
      const pureRoute = route[0].split('/').join('');
      //console.log('onGoodAuthMsg: pureRoute=<', pureRoute,'>');
      const purePath = jsonMsg.path.split('/').join('');
      //console.log('onGoodAuthMsg: purePath=<', purePath,'>');
      if(purePath === pureRoute) {
        return onMatchRoute(route,jsonMsg,ws);
      }
    }
  } catch(err) {
    console.log('onGoodAuthMsg: err=<', err,'>');
    ws.send(JSON.stringify(err));
  }
  console.log('onGoodAuthMsg: jsonMsg=<', jsonMsg,'>');
  console.log('onGoodAuthMsg: Routes=<', Routes,'>');
};
const onMatchRoute = async (route,jsonMsg,ws) => {
  //console.log('onMatchRoute: route=<', route,'>');
  const controllerPartern = route[1];
  //console.log('onMatchRoute: controllerPartern=<', controllerPartern,'>');
  const routeP = controllerPartern.split('@');
  const path1 = routeP[0];
  const path2 = path1.split('.').join('/');
  const pathJs = `./controller/${path2}.js`;
  //console.log('onMatchRoute: pathJs=<', pathJs,'>');
  const Controller = require(pathJs);
  //console.log('onMatchRoute: Controller=<', Controller,'>');
  const controller = new Controller();
  //console.log('onMatchRoute: controller=<', controller,'>');
  const method = routeP[1];
  console.log('onMatchRoute: method=<', method,'>');
  const reply = await controller[method](jsonMsg);
  if(reply) {
    ws.send(JSON.stringify(reply));
  }
}

/*
const MongoStorage = require('./storage.js');
const mongo = new MongoStorage();

const onGoodAuthMsg = (jsonMsg,ws) => {
  console.log('onGoodAuthMsg: jsonMsg=<', jsonMsg,'>');
  if(jsonMsg.payload) {
    const payload = jsonMsg.payload;
    if(payload.act === 'signup') {
      mongo.saveSignup(jsonMsg);
    } else if(payload.act === 'signin') {
      mongo.saveSignin(jsonMsg);
      mongo.fetchToken(jsonMsg.token,(profile)=> {
       onGoodAccount(profile,ws);
      });
    } else if(payload.act === 'profile') {
      mongo.saveProfile(jsonMsg);
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
*/
