window.addEventListener('load', () =>{
  _loadLoginKey();
});

const _LOGIN_PUB_KEY = 'wator.sec.auth.login.key.public';
const _LOGIN_SCR_KEY = 'wator.sec.auth.login.key.secret';

class LoginEDDSA {
  constructor(cb) {
    this._loadLoginKey(cb);
    this._sign(cb);
  }
  _loadLoginKey(cb){
    const pubKey = localStorage.getItem(_LOGIN_PUB_KEY);
    //console.log('_loadLoginKey::pubKey:=<',pubKey,'>');
    const scrKey = localStorage.getItem(_LOGIN_SCR_KEY);
    //console.log('_loadLoginKey::scrKey:=<',scrKey,'>');
    if(pubKey && scrKey) {
      this._verifyLoginKey(pubKey,scrKey);
    } else {
      this._createLoginKey();
    }
  }
  _sign(cb) {
    const random = document.getElementById('wator_sec_login_server_random').textContent;
    console.log('_loadLoginKey::random:=<',random,'>');
    const encoder = new TextEncoder();
    const randomByte = encoder.encode(random);
    console.log('_loadLoginKey::this._secretKey:=<',this._secretKey,'>');
    const signature = nacl.sign(randomByte,this._secretKey);
    const signatureB64 = nacl.util.encodeBase64(signature);
    console.log('_loadLoginKey::signatureB64:=<',signatureB64,'>');
    cb(this._pubB64,signatureB64);    
  }
  
  _verifyLoginKey( pubKey,scrKey ) {
    //console.log('_verifyLoginKey::pubKey:=<',pubKey,'>');
    //console.log('_verifyLoginKey::scrKey:=<',scrKey,'>');
    const secretKey = nacl.util.decodeBase64(scrKey);
    //console.log('_verifyLoginKey::secretKey:=<',secretKey,'>');
    const keyPair = nacl.sign.keyPair.fromSecretKey(secretKey);
    //console.log('_verifyLoginKey::keyPair:=<',keyPair,'>');
    const pubB64 = nacl.util.encodeBase64(keyPair.publicKey);
    //console.log('_createLoginKey::pubB64:=<',pubB64,'>');
    if(pubKey === pubB64) {
      this._publicKey = keyPair.publicKey;
      this._secretKey = keyPair.secretKey;
      this._pubB64 = pubB64;
     return true;
    }
    return this._createLoginKey();
  }
  _createLoginKey( ) {
    const keyPair = nacl.sign.keyPair();
    //console.log('_createLoginKey::keyPair:=<',keyPair,'>');
    const pubB64 = nacl.util.encodeBase64(keyPair.publicKey);
    //console.log('_createLoginKey::pubB64:=<',pubB64,'>');
    const scrB64 = nacl.util.encodeBase64(keyPair.secretKey);
    //console.log('_createLoginKey::scrB64:=<',scrB64,'>');
    localStorage.setItem(_LOGIN_PUB_KEY,pubB64);
    localStorage.setItem(_LOGIN_SCR_KEY,scrB64);
    this._publicKey = keyPair.publicKey;
    this._secretKey = keyPair.secretKey;
    this._pubB64 = pubB64;
    return true;
  }
};

const _loadLoginKey = () => {
  var gLogInKey = new LoginEDDSA((pubB64,signature)=>{
    //console.log('_loadLoginKey::pubB64:=<',pubB64,'>');
    if(typeof onLoginKeyLoaded === 'function') {
      onLoginKeyLoaded(pubB64,signature);
    }
  });
}

