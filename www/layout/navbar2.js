const navbarTemplate = 
`
  <div class="container-fluid">
    <ul class="navbar-nav nav justify-content-start">
      <li class="nav-item active">
        <a class="btn btn-lg btn-primary nav-btn" href="/" role="button">
          <i class="material-icons md-48">home</i>
        </a>
      </li>
      <li class="nav-item active ml-lg-4">
        <a class="btn btn-lg btn-primary nav-btn" href="/about" role="button">
          <i class="material-icons md-48">copyright</i>
        </a>
      </li>
    </ul>
    <ul class="navbar-nav nav justify-content-end">
      <li class="nav-item dropdown mr-5">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i class="material-icons md-48">language</i>
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
          <div class="row ml-2">
            <div class="col">
              <a class="" href="#"><span class="flag-icon flag-icon-background flag-icon-cn"></span></a>
            </div>
            <div class="col">
              <a class="" href="#"><span class="flag-icon flag-icon-background flag-icon-jp"></span></a>
            </div>
          </div> 
          <div class="row ml-2 mt-2">
            <div class="col">
              <a class="" href="#"><span class="flag-icon flag-icon-background flag-icon-us"></span></a>
            </div>
            <div class="col">
              <a class="" href="#"><span class="flag-icon flag-icon-background flag-icon-ru"></span></a>
            </div>
          </div>
        </div>
      </li>
      <li class="nav-item active">
        <a role="button" class="btn btn-warning btn-lg mr-lg-5" href="/secauth/login" role="button">
          <i class="material-icons md-48">person</i>
        </a>
      </li>
      <li class="nav-item active">
        <a role="button" class="btn btn-warning btn-lg" href="/secauth/signup" role="button">
          <i class="material-icons md-48">person_add</i>
        </a>
      </li>
    </ul>
  </div>
`

Vue.component('w-navbar', {
  template: navbarTemplate
});

$(document).ready( () => {
  const topNaveBar = new Vue({
    el: '#vue-navbar-top'
  });
});

$(function () {
  $('[data-toggle="popover"]').popover({html:true});
})
