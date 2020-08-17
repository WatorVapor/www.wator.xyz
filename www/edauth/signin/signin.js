const edauth = new EDAuth();
const wss = new WatorWss();
$(document).ready( () => {
  onLoadKey();
});
const onLoadKey = () => {
  const token = edauth.getTokenKey();
  
  const singin = new Vue({
    el: '#vue-signin',
    data: {
      token:token
    }
  });
  console.log('onLoadKey::singin=<',singin,'>');
}

const onUIClickSignin = (elem) => {
  //console.log('onUIClickSignin::elem=<',elem,'>');
  const msg = {
    act:'signin'
  };
  const tokenMsg = edauth.sign(msg);
  //console.log('onUIClickSignin::tokenMsg=<',tokenMsg,'>');
  wss.sendMsg(tokenMsg);
}