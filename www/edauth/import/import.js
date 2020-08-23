const edauth = new EDAuth();
$(document).ready( () => {
});

const tokenApp = new Vue({
  el: '#vue-import-token',
  data: {
    token:''
  }
});

const onLoadKeyImport = () => {
  const token = edauth.getTokenKey();
  console.log('onLoadKeyProfile::tokenApp=<',tokenApp,'>');
  const profile = edauth.getProfile();
  console.log('onLoadKeyProfile::profile=<',profile,'>');
  const nameApp = new Vue({
    el: '#vue-profile-name',
    data: profile
  });
  console.log('onLoadKeyProfile::nameApp=<',nameApp,'>');
}

const onUIClickImport = (elem) => {
  console.log('onUIClickImport::elem=<',elem,'>');
  //edauth.importSecret();
  const privateKey = document.getElementById('private-key').value;
  console.log('onUIClickImport::privateKey=<',privateKey,'>');
  if(privateKey) {
    const token = edauth.importSecret(privateKey);
    tokenApp.token = token;
  }
}

