const edauth = new EDAuth();
const wss = new WatorWss();
$(document).ready( () => {
  onLoadKey();
});
const onLoadKey = () => {
  const token = edauth.getTokenKey();
  const singin = Vue.createApp({
    data() {
      return {token:token};
    }     
  });
  singin.mount('#vue-signin');
  //console.log('onLoadKey::singin=<',singin,'>');
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

wss.onMsg = (msg)=> {
  //console.log('wss.onMsg::msg=<',msg,'>');
  if(msg.payload && msg.payload.act === 'signup') {
    edauth.saveSignin(msg);
    history.back();
  }
}