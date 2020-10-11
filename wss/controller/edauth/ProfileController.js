const EdAuth = require('../../model/edauth.js');

class ProfileController {
  constructor() {
    
  }
  async store(request,reply) {
    //console.log('ProfileController::store::request=<',request,'>');
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
module.exports = ProfileController;
