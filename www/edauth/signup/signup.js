const edauth = new EDAuth();
const wss = new WatorWss();
const onUIClickCreateKey = (elem) => {
  edauth.create();
  const token = edauth.getTokenKey();
  const tokenElem = document.getElementById('signup-tokenKey');
  if(token && tokenElem) {
    tokenElem.value = token;
  }
  const secret = edauth.getSecretKey();
  const secretElem = document.getElementById('signup-secretKey');
  if(secret && secretElem) {
    secretElem.textContent = secret;
    secretElem.setAttribute('class','text-center');
  }
  const blob = new Blob([secret], {type: 'text/plain'});
  const url = URL.createObjectURL(blob);
  const downloadElem = document.getElementById('signup-download');
  if(downloadElem) {
    downloadElem.href = url;
  }
  //$('#signup-secretKey-QRCode').qrcode(secret);
  const qrcode = new QRCode(document.getElementById('signup-secretKey-QRCode'),secret);
  //console.log('onUIClickCreateKey::qrcode=<',qrcode,'>');
  const imageType = 'image/png';
  const canvas = document.getElementById('signup-secretKey-QRCode').getElementsByTagName('canvas')[0];
  const urlQRcode = canvas.toDataURL(imageType);
  const downloadQRcodeElem = document.getElementById('signup-download-qrcode');
  if(downloadQRcodeElem) {
    downloadQRcodeElem.href = urlQRcode;
  }
}

const onUIClickUploadAccount = (elem) => {
  //console.log('onUIClickUploadAccount::elem=<',elem,'>');
  const nameElem = document.getElementById('signup-name');
  const msg = {
    act:'signup',
    profile:{
      name:nameElem.value
    }
  };
  const tokenMsg = edauth.sign(msg);
  console.log('onUIClickUploadAccount::tokenMsg=<',tokenMsg,'>');
  wss.sendMsg(tokenMsg);
}