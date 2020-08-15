const keyConstOfLocalStorage = 'wator/edauth/keypair';
const signMsgByAccoutKey = (msg)=> {
  const keyPair = JSON.parse(localStorage.getItem(keyConstOfLocalStorage));
  console.log('signMsgByAccoutKey::keyPair=<',keyPair,'>');
  const secretKey = nacl.util.decodeBase64(keyPair.secretKey);
  console.log('signMsgByAccoutKey::secretKey=<',secretKey,'>');
  const keyPairObj = nacl.sign.keyPair.fromSecretKey(secretKey);
  console.log('signMsgByAccoutKey::keyPairObj=<',keyPairObj,'>');
  const tokenCalc = calcTokenKey(keyPairObj.publicKey);
  console.log('signMsgByAccoutKey::tokenCalc=<',tokenCalc,'>');
  if(keyPair.tokenKey !== tokenCalc) {
    return msg;
  }
  const signMsgObj = {
    payload:msg,
    ts:(new Date()).toISOString(),
    token:tokenCalc
  };
  console.log('signMsgByAccoutKey::signMsgObj=<',signMsgObj,'>');
  const toSignSHA3 = CryptoJS.SHA3(JSON.stringify(signMsgObj), { outputLength: 512  }).toString(CryptoJS.enc.Base64);
  const toSignRIPEMD160 = CryptoJS.RIPEMD160(toSignSHA3).toString(CryptoJS.enc.Base64);
  const toSignMsg = nacl.util.decodeBase64(toSignRIPEMD160);
  const signed = nacl.sign(toSignMsg,keyPairObj.secretKey);
  console.log('signMsgByAccoutKey::signed=<',signed,'>');
  const signedB64 = nacl.util.encodeBase64(signed);
  console.log('signMsgByAccoutKey::signedB64=<',signedB64,'>');
  signMsgObj.auth = {};
  signMsgObj.auth.sign = signedB64;
  signMsgObj.auth.key = keyPair.publicKey;
  return signMsgObj;
}


const calcTokenKey = (publicKey) => {
  const bs64Public = nacl.util.encodeBase64(publicKey);
  //console.log('createEdAuthKey::bs64Public=<',bs64Public,'>');
  const hashPublic = CryptoJS.SHA3(bs64Public, { outputLength: 512 }).toString(CryptoJS.enc.Base64);
  //console.log('createEdAuthKey::hashPublic=<',hashPublic,'>');
  const ripemdPublic = CryptoJS.RIPEMD160(hashPublic).toString(CryptoJS.enc.Base64);
  //console.log('createEdAuthKey::ripemdPublic=<',ripemdPublic,'>');
  const ripeBuffer = nacl.util.decodeBase64(ripemdPublic);
  const tokenKey = Base58.encode(ripeBuffer);
  //console.log('createEdAuthKey::tokenKey=<',tokenKey,'>');
  return tokenKey;
}
