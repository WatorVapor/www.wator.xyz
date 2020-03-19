'use strict'

const nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');

class LoginController {
  index ({ request, response,view  }) {
    const random = nacl.randomBytes(32);
    const randomBase64 = nacl.util.encodeBase64(random);
    return view.render('login',{login_server_random:randomBase64});
  }
}

module.exports = LoginController
