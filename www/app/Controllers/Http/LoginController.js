'use strict'

class LoginController {
  index ({ request, response,view  }) {
    response.header('LoginRadom', 'application/json');
    return view.render('login',{});
  }
}

module.exports = LoginController
