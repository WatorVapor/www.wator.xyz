const edauth = new EDAuth();
const wss = new WatorWss();
$(document).ready( () => {
  onLoadKeyProfile();
});
const onLoadKeyProfile = () => {
  const token = edauth.getTokenKey();
  const tokenApp = Vue.createApp({
    data() {
      return {token:token};
    }    
  });
  tokenApp.mount('#vue-profile-token');
  //console.log('onLoadKeyProfile::tokenApp=<',tokenApp,'>');
  const profile = edauth.getProfile();
  //console.log('onLoadKeyProfile::profile=<',profile,'>');
  const nameApp = Vue.createApp({
    data() {
      return profile;
    }    
  });
  nameApp.mount('#vue-profile-name');
  //console.log('onLoadKeyProfile::nameApp=<',nameApp,'>');
}

const onUIClickProfile = (elem) => {
  //console.log('onUIClickProfile::elem=<',elem,'>');
  const name = document.getElementById('profile-name').value;
  //console.log('onUIClickProfile::name=<',name,'>');
  const msg = {
    act:'profile',
    name:name
  };
  const tokenMsg = edauth.sign(msg);
  //console.log('onUIClickProfile::tokenMsg=<',tokenMsg,'>');
  wss.sendMsg(tokenMsg);
}

wss.onMsg = (msg)=> {
  //console.log('wss.onMsg::msg=<',msg,'>');
  if(msg.payload && msg.payload.act === 'signup') {
    edauth.saveSignin(msg);
    history.back();
  }
}
