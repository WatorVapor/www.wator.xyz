const route = [
  ['/edauth/signup','edauth.SignupController@store'],
  ['/edauth/profile','edauth.ProfileController@store'],
  ['/edauth/signin','edauth.SigninController@fetch'],
];
module.exports = route;