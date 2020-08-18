const edauth = new EDAuth();
$(document).ready( () => {
  edauth.removeSignin();
  history.back();
});
