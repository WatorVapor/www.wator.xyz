const EdAuth = require('../../model/edauth.js');
class SignupController {
  constructor() {
  }
  async store(request) {
    //console.log('SignupController::store::request=<',request,'>');
    const oldAuth = await EdAuth.findOne({t:request.token}).sort({s: -1});
    console.log('SignupController::store::oldAuth=<',oldAuth,'>');
    if(!oldAuth) {
      const toSave = {
        t:request.token,
        s:request.ts,
        o:JSON.stringify(request)
      };
      const newAuth = new EdAuth(toSave);
      console.log('SignupController::store::newAuth=<',newAuth,'>');
      newAuth.save();
    }
  }
}
module.exports = SignupController;
