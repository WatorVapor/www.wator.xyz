const keyConstOfLocalStorage = 'wator/edauth/keypair';
const strConstTokenPrefix = 'W';

class EDAuth {
  constructor() {
    
  }
  create(){
    const keyToSave = this.createGoodKey_();
    //console.log('EDAuth::create::keyToSave=<',keyToSave,'>');
    localStorage.setItem(keyConstOfLocalStorage,JSON.stringify(keyToSave));
  }
  getTokenKey(){
    const keyPair = JSON.parse(localStorage.getItem(keyConstOfLocalStorage));
    //console.log('EDAuth::getTokenKey::keyPair=<',keyPair,'>');
    return keyPair.tokenKey;
  }

  getSecretKey(){
    const keyPair = JSON.parse(localStorage.getItem(keyConstOfLocalStorage));
    //console.log('EDAuth::getSecretKey::keyPair=<',keyPair,'>');
    return keyPair.secretKey;
  }
  getPublicKey(){
    const keyPair = JSON.parse(localStorage.getItem(keyConstOfLocalStorage));
    //console.log('EDAuth::getPublicKey::keyPair=<',keyPair,'>');
    return keyPair.publicKey;
  }

  sign(msg) {
    const keyPair = JSON.parse(localStorage.getItem(keyConstOfLocalStorage));
    //console.log('EDAuth::sign::keyPair=<',keyPair,'>');
    const secretKey = nacl.util.decodeBase64(keyPair.secretKey);
    //console.log('EDAuth::sign::secretKey=<',secretKey,'>');
    const keyPairObj = nacl.sign.keyPair.fromSecretKey(secretKey);
    //console.log('EDAuth::sign::keyPairObj=<',keyPairObj,'>');
    const tokenCalc = this.calcTokenKey_(keyPairObj.publicKey);
    //console.log('EDAuth::sign::tokenCalc=<',tokenCalc,'>');
    if(keyPair.tokenKey !== tokenCalc) {
      return msg;
    }
    const signMsgObj = {
      payload:msg,
      ts:(new Date()).toISOString(),
      token:tokenCalc
    };
    //console.log('EDAuth::sign::signMsgObj=<',signMsgObj,'>');
    const toSignSHA3 = CryptoJS.SHA3(JSON.stringify(signMsgObj), { outputLength: 512  }).toString(CryptoJS.enc.Base64);
    const toSignRIPEMD160 = CryptoJS.RIPEMD160(toSignSHA3).toString(CryptoJS.enc.Base64);
    const toSignMsg = nacl.util.decodeBase64(toSignRIPEMD160);
    const signed = nacl.sign(toSignMsg,keyPairObj.secretKey);
    //console.log('EDAuth::sign::signed=<',signed,'>');
    const signedB64 = nacl.util.encodeBase64(signed);
    //console.log('EDAuth::sign::signedB64=<',signedB64,'>');
    signMsgObj.auth = {};
    signMsgObj.auth.sign = signedB64;
    signMsgObj.auth.key = keyPair.publicKey;
    return signMsgObj;
  }


  createGoodKey_(){
    while(true) {
      const keyPair = nacl.sign.keyPair();
      //console.log('EDAuth::createGoodKey_::keyPair=<',keyPair,'>');
      const bs64Secret = nacl.util.encodeBase64(keyPair.secretKey);
      //console.log('EDAuth::createGoodKey_::bs64Secret=<',bs64Secret,'>');
      const bs64Public = nacl.util.encodeBase64(keyPair.publicKey);
      //console.log('EDAuth::createGoodKey_::bs64Public=<',bs64Public,'>');
      const tokenKey = this.calcTokenKey_(keyPair.publicKey);
      //console.log('EDAuth::createGoodKey_::tokenKey=<',tokenKey,'>');
      if(tokenKey.startsWith(strConstTokenPrefix) === false) {
        continue;
      }
      const keyToSave = {
        publicKey:bs64Public,
        secretKey:bs64Secret,
        tokenKey:tokenKey
      };
      return keyToSave;
    }
  }

  calcTokenKey_ (publicKey) {
    const bs64Public = nacl.util.encodeBase64(publicKey);
    //console.log('calcTokenKey_::bs64Public=<',bs64Public,'>');
    const hashPublic = CryptoJS.SHA3(bs64Public, { outputLength: 512 }).toString(CryptoJS.enc.Base64);
    //console.log('calcTokenKey_::hashPublic=<',hashPublic,'>');
    const ripemdPublic = CryptoJS.RIPEMD160(hashPublic).toString(CryptoJS.enc.Base64);
    //console.log('calcTokenKey_::ripemdPublic=<',ripemdPublic,'>');
    const ripeBuffer = nacl.util.decodeBase64(ripemdPublic);
    const tokenKey = Base58.encode(ripeBuffer);
    //console.log('calcTokenKey_::tokenKey=<',tokenKey,'>');
    return tokenKey;
  }

}



