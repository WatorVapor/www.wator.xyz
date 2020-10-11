const EdAuth = require('../../model/edauth.js');
class SigninController {
  constructor() {
  }
  async fetch(request) {
    //console.log('SigninController::fetch::request=<',request,'>');
    const savedAuth = await EdAuth.findOne({t:request.token}).sort({s: -1}).limit(1);
    console.log('SigninController::fetch::savedAuth=<',savedAuth,'>');
    if(savedAuth) {
      return JSON.parse(savedAuth.o);
    }
    return {};
  }
}
module.exports = SigninController;
