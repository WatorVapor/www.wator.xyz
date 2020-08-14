const iConstOnePageResult = 16;

//console.log(':: location=<', location,'');
const uri = 'wss://' + location.hostname + '/ermu/wss';
const socket = new WebSocket(uri);
socket.addEventListener('open', (event) => {
  setTimeout(() => {
    onOpenWSS(event);
    onPrepareKey();
  },1);
});
socket.addEventListener('close', (event) => {
  onCloseWSS(event);
});
socket.addEventListener('error', (event) => {
  onErrorWSS(event);
});
socket.addEventListener('message', (event) => {
  onMessageWSS(event);
});


const onOpenWSS = (event)=> {
  //console.log('onOpenWSS:: event=<', event,'>');
  const route = parseRoute();
  console.log('onOpenWSS:: route=<', route,'>');
  if(route === 'search') {
    const searchMsg = getHistory();
    console.log('onOpenWSS:: searchMsg=<', searchMsg,'>');
    if(searchMsg.words) {
      startSearchText(searchMsg);
    }
  }
};
const onCloseWSS = (event)=> {
  console.log('onCloseWSS:: event=<', event,'>');
};
const onErrorWSS = (event)=> {
  console.log('onErrorWSS:: event=<', event,'>');
};

const parseURLParam =() => {
  //console.log('parseURLParam:: window.location.search=<', window.location.search,'>');
  const urlParams = new URLSearchParams(window.location.search);
  //console.log('parseURLParam:: urlParams=<', urlParams,'>');
  let words = urlParams.get('words');
  //console.log('parseURLParam:: words=<', words,'>');
  let begin = parseInt(urlParams.get('begin'));
  //console.log('parseURLParam:: begin=<', begin,'>');
  let end = parseInt(urlParams.get('end'));
  //console.log('parseURLParam:: end=<', end,'>');
  return { words:words,begin:begin,end:end};
}

const parseRoute = () => {
  //console.log('parseRoute:: window.location.pathname=<', window.location.pathname,'>');
  if(window.location.pathname.endsWith('search.html')) {
    return 'search';
  }
  if(window.location.pathname.endsWith('/ermu/')) {
    return 'ermu';
  }
  return '';
}


const onMessageWSS = (event)=> {
  //console.log('onMessageWSS:: event.data=<', event.data,'>');
  try {
    const jMsg = JSON.parse(event.data);
    //console.log('onMessageWSS:: jMsg=<', jMsg,'>');
    if (jMsg.kword) {
      onKWordResult(jMsg.kword,jMsg.cbtag);
    } else if (jMsg.kvalue) {
      onKValueResult(jMsg.kvalue);
    } else {
      console.log('onMessageWSS:: jMsg=<', jMsg,'>');
    }
  } catch (e) {
    console.log('onMessageWSS:: e=<', e,'>');
  }
};

let gTotalPageNumber = false;
const gAllResultsByCID = {};

const gResultMemoByCBTag = {};

const onKWordResult = (msg,cbtag) => {
  console.log('onKWordResult:: msg=<', msg,'>');
  if(!gResultMemoByCBTag[cbtag]) {
    gResultMemoByCBTag[cbtag] = msg.total;
  } else {
    if(gResultMemoByCBTag[cbtag] > msg.total) {
      return;
    } else {
      gResultMemoByCBTag[cbtag] = msg.total;
    }
  }
  if(msg.total > -1) {
    try {
      gTotalPageNumber = Math.ceil(parseInt(msg.total)/iConstOnePageResult);
      onShowStatsResultApp(msg);
      for(const cid of msg.content) {
        if(!gAllResultsByCID[cid]){
          gAllResultsByCID[cid] = true
          //console.log('onKWordResult:: cid=<', cid,'>');
          onShowSearchResultFrameRow(cid);
        }
      }
    } catch (e) {
      console.log('onKWordResult:: e=<', e,'>');
    }    
  }
}

const onKValueResult = (msg) => {
  console.log('onKValueResult:: msg=<', msg,'>');
  if(msg.address && msg.content) {
    onShowSearchResultOneRow(msg.address,msg.content);
  }
}





const LocalStorageHistory = 'wator/ermu/history';

const startSearchText = (searchMsg) => {
  localStorage.setItem(LocalStorageHistory,JSON.stringify(searchMsg));
  //console.log('onMessageWSS::startSearchText searchMsg=<', searchMsg,'>');
  if(socket) {
    socket.send(JSON.stringify(searchMsg));
  }
};

const getHistoryKeywords = () => {
  const historyStr = localStorage.getItem(LocalStorageHistory);
  try {
    const historyJson = JSON.parse(historyStr);
    //console.log('onMessageWSS::getHistoryKeywords historyJson=<', historyJson,'>');
    return historyJson.words;
  } catch(e) {
    console.log('onMessageWSS::getHistoryKeywords e=<', e,'>');
  }
  return null;
};

const getHistory = () => {
  const historyStr = localStorage.getItem(LocalStorageHistory);
  try {
    const historyJson = JSON.parse(historyStr);
    //console.log('onMessageWSS::getHistory historyJson=<', historyJson,'>');
    return historyJson;
  } catch(e) {
    console.log('onMessageWSS::getHistory e=<', e,'>');
  }
  return {};
};



const LOCAL_STORAGE_ACCESS_KEY = 'wator/ermu/ed25519/key';
const onPrepareKey = () => {
  if(!loadKey()) {
    createKey();
  }
};

const createKey = () => {
  const keyPair = nacl.sign.keyPair();
  //console.log('createKey::keyPair=<', keyPair,'>');
  const pubKeyB64 = nacl.util.encodeBase64(keyPair.publicKey);
  //console.log('createKey::pubKeyB64=<', pubKeyB64,'>');
  const keyId = calcKeyID(pubKeyB64);
  console.log('createKey::keyId=<', keyId,'>');
  const secKeyB64 = nacl.util.encodeBase64(keyPair.secretKey);
  //console.log('createKey::secKeyB64=<', secKeyB64,'>');
  const keyStorage = {
    keyId:keyId,
    publicKey:pubKeyB64,
    secretKey:secKeyB64
  }
  //console.log('createKey::keyStorage=<', keyStorage,'>');
  localStorage.setItem(LOCAL_STORAGE_ACCESS_KEY,JSON.stringify(keyStorage,undefined,2));
};

const loadKey = () => {
  const saveKeyStr = localStorage.getItem(LOCAL_STORAGE_ACCESS_KEY);
  const saveKeyJson = JSON.parse(saveKeyStr);
  if(!saveKeyJson) {
    return false;
  }
  //console.log('loadKey::saveKeyJson=<', saveKeyJson,'>');
  if(saveKeyJson && saveKeyJson.publicKey && saveKeyJson.keyId && saveKeyJson.secretKey) {
    const keyId = calcKeyID(saveKeyJson.publicKey);
    //console.log('loadKey::keyId=<', keyId,'>');
    if(keyId === saveKeyJson.keyId) {
      const newPair = nacl.sign.keyPair.fromSecretKey(nacl.util.decodeBase64(saveKeyJson.secretKey));
      //console.log('loadKey::newPair=<', newPair,'>');
      const pubKeyB64 = nacl.util.encodeBase64(newPair.publicKey);
      if(pubKeyB64 === saveKeyJson.publicKey) {
        return true;
      }
    }
  }
  return false;
};

const calcKeyID = (pubKeyB64) => {
  const keyHash512 =  CryptoJS.SHA512(pubKeyB64);
  //console.log('calcKeyID::keyHash512=<', keyHash512,'>');
  const hash160 = CryptoJS.RIPEMD160(keyHash512.toString(CryptoJS.enc.Base64));
  //console.log('calcKeyID::hash160=<', hash160,'>');
  const keyB64 = hash160.toString(CryptoJS.enc.Base64);
  //console.log('calcKeyID::keyB64=<', keyB64,'>');
  const keyB58 = Base58.encode(nacl.util.decodeBase64(keyB64));
  //console.log('calcKeyID::keyB58=<', keyB58,'>');
  return keyB58;
};
