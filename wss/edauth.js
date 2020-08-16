const CryptoJS = require('crypto-js');
const Base58 = require('base-58');
const nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');

class EDAuth {
  constructor() {
    
  }
  verify(msg) {
    console.log('EDAuth::verify::msg=<',msg,'>');
    const calcToken = this.calcTokenKey_(msg.auth.key);
    console.log('EDAuth::verify::calcToken=<',calcToken,'>');
    return false;
  }
  calcTokenKey_ (publicKey) {
    const bs64Public = nacl.util.encodeBase64(publicKey);
    //console.log('EDAuth::calcTokenKey_::bs64Public=<',bs64Public,'>');
    const hashPublic = CryptoJS.SHA3(bs64Public, { outputLength: 512 }).toString(CryptoJS.enc.Base64);
    //console.log('EDAuth::calcTokenKey_::hashPublic=<',hashPublic,'>');
    const ripemdPublic = CryptoJS.RIPEMD160(hashPublic).toString(CryptoJS.enc.Base64);
    //console.log('EDAuth::calcTokenKey_::ripemdPublic=<',ripemdPublic,'>');
    const ripeBuffer = nacl.util.decodeBase64(ripemdPublic);
    const tokenKey = Base58.encode(ripeBuffer);
    //console.log('EDAuth::calcTokenKey_::tokenKey=<',tokenKey,'>');
    return tokenKey;
  }
}
module.exports = EDAuth;
