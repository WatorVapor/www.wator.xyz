const CryptoJS = require('crypto-js');
const Base58 = require('base-58');
const nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');

class EDAuth {
  constructor() {
    
  }
  verify(msg) {
    console.log('EDAuth::verify::msg=<',msg,'>');
    if(!msg.token.startsWith('W')) {
      return false;
    }
    const created_at = new Date(msg.ts);
    const now = new Date();
    const escape_ms = now - created_at;
    //console.log('EDAuth::verify::escape_ms=<',escape_ms,'>');
    if(escape_ms > 1000*5) {
      console.log('EDAuth::verify::escape_ms=<',escape_ms,'>');
      return false;
    } 
    const calcToken = this.calcTokenKeyBS64_(msg.auth.key);
    //console.log('EDAuth::verify::calcToken=<',calcToken,'>');
    if(calcToken !== msg.token) {
      return false;
    }
    const publicKey = nacl.util.decodeBase64(msg.auth.key);
    const signMsg = nacl.util.decodeBase64(msg.auth.sign);
    //console.log('EDAuth::verify::publicKey=<',publicKey,'>');
    //console.log('EDAuth::verify::signMsg=<',signMsg,'>');
    const orignal = nacl.sign.open(signMsg,publicKey);
    if(!orignal) {
      console.log('EDAuth::verify::orignal=<',orignal,'>');
      return false;
    }
    const orignalB64 = nacl.util.encodeBase64(orignal);
    //console.log('EDAuth::verify::orignalB64=<',orignalB64,'>');
    const msgCal = Object.assign({},msg);
    delete msgCal.auth;
    const toCalSHA3 = CryptoJS.SHA3(JSON.stringify(msgCal), { outputLength: 512  }).toString(CryptoJS.enc.Base64);
    const toCalRIPEMD160 = CryptoJS.RIPEMD160(toCalSHA3).toString(CryptoJS.enc.Base64);
    //console.log('EDAuth::verify::toCalRIPEMD160=<',toCalRIPEMD160,'>');
    if(orignalB64 === toCalRIPEMD160) {
      return true;
    } else {
      console.log('EDAuth::verify::orignalB64=<',orignalB64,'>');
      console.log('EDAuth::verify::toCalRIPEMD160=<',toCalRIPEMD160,'>');
    }
    return false;
  }
  calcTokenKeyBS64_ (bs64Public) {
    //console.log('EDAuth::calcTokenKeyBS64_::bs64Public=<',bs64Public,'>');
    const hashPublic = CryptoJS.SHA3(bs64Public, { outputLength: 512 }).toString(CryptoJS.enc.Base64);
    //console.log('EDAuth::calcTokenKeyBS64_::hashPublic=<',hashPublic,'>');
    const ripemdPublic = CryptoJS.RIPEMD160(hashPublic).toString(CryptoJS.enc.Base64);
    //console.log('EDAuth::calcTokenKeyBS64_::ripemdPublic=<',ripemdPublic,'>');
    const ripeBuffer = nacl.util.decodeBase64(ripemdPublic);
    const tokenKey = Base58.encode(ripeBuffer);
    //console.log('EDAuth::calcTokenKeyBS64_::tokenKey=<',tokenKey,'>');
    return tokenKey;
  }
}
module.exports = EDAuth;
