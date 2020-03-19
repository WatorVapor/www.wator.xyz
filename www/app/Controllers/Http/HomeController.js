'use strict'

class HomeController {
  index ({ request, response,view  }) {
    return view.render('home',{});
  }
}
module.exports = HomeController
