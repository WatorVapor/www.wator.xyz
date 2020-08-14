const keyConstOfLocalStorage = 'wator/edauth/keypair';
const createEdAuthKey = () => {
  const keyPair = nacl.sign.keyPair();
  //console.log('createEdAuthKey::keyPair=<',keyPair,'>');
  const bs64Secret = nacl.util.encodeBase64(keyPair.secretKey);
  //console.log('createEdAuthKey::bs64Secret=<',bs64Secret,'>');
  const bs64Public = nacl.util.encodeBase64(keyPair.publicKey);
  //console.log('createEdAuthKey::bs64Public=<',bs64Public,'>');
  const hashPublic = CryptoJS.SHA3(bs64Public, { outputLength: 512 }).toString(CryptoJS.enc.Base64);
  //console.log('createEdAuthKey::hashPublic=<',hashPublic,'>');
  const ripemdPublic = CryptoJS.RIPEMD160(hashPublic).toString(CryptoJS.enc.Base64);
  //console.log('createEdAuthKey::ripemdPublic=<',ripemdPublic,'>');
  const ripeBuffer = nacl.util.decodeBase64(ripemdPublic);
  const tokenKey = Base58.encode(ripeBuffer);
  //console.log('createEdAuthKey::tokenKey=<',tokenKey,'>');
  const keyToSave = {
    publicKey:bs64Public,
    secretKey:bs64Secret,
    tokenKey:tokenKey
  };
  //console.log('createEdAuthKey::keyToSave=<',keyToSave,'>');
  localStorage.setItem(keyConstOfLocalStorage,JSON.stringify(keyToSave));
}
const getTokenKey = ()=> {
  const keyPair = JSON.parse(localStorage.getItem(keyConstOfLocalStorage));
  //console.log('getTokenKey::keyPair=<',keyPair,'>');
  return keyPair.tokenKey;
}

const getSecretKey = ()=> {
  const keyPair = JSON.parse(localStorage.getItem(keyConstOfLocalStorage));
  //console.log('getSecretKey::keyPair=<',keyPair,'>');
  return keyPair.secretKey;
}
