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
    <ul class="navbar-nav nav justify-content-center">
      <li class="nav-item active ml-lg-4">
        <a class="btn btn-lg btn-info nav-btn" href="/otmc/" role="button">
          <i class="text-primary material-icons md-48">assistant_direction</i>
          <i class="text-primary material-icons md-48">near_me</i>
          <i class="text-primary material-icons md-48">map</i>
          <i class="text-primary material-icons md-48">maps_home_work</i>
          <i class="text-primary material-icons md-48">factory</i>
        </a>
      </li>
    </ul>
    <ul class="navbar-nav nav justify-content-end">
      <li class="nav-item dropdown mr-5">
        <a class="nav-link dropdown-toggle btn-lg" href="#" id="navbarDropdownLang" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i class="material-icons md-48">apps</i>
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdownLang">
          <div class="row ml-2">
            <div class="col">
              <a class=""  target="_blank" href="/ermu/"><i class="material-icons md-48">search</i></a>
            </div>
            <div class="col">
              <a class=""  target="_blank" href="/niuma/"><i class="material-icons md-48">electric_car</i></a>
            </div>
          </div> 
          <div class="row ml-2 mt-3">
            <div class="col">
              <a class=""  target="_blank" href="/cheaplidar/"><i class="material-icons md-48">radar</i></a>
            </div>
            <div class="col">
              <a class=""  target="_blank" href="/starbian/"><i class="material-icons md-48">flare</i></a>
            </div>
          </div> 
          <div class="row ml-2 mt-3">
            <div class="col">
              <a class="" target="_blank" href="/gps/"><i class="material-icons md-48">gps_fixed</i></a>
            </div>
            <div class="col">
              <a class="" target="_blank" href="/webstereo/"><i class="material-icons md-48">monochrome_photos</i></a>
            </div>
          </div> 
          <div class="row ml-2 mt-3">
            <div class="col">
              <a class="" target="_blank" href="/webslam/"><i class="material-icons md-48">cloud_circle</i></a>
            </div>
            <div class="col">
            </div>
          </div>        </div>
      </li>
      <li class="nav-item dropdown mr-5">
        <a class="nav-link dropdown-toggle btn-lg" href="#" id="navbarDropdownLang" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i class="material-icons md-48">language</i>
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdownLang">
          <div class="row ml-2">
            <div class="col">
              <a class="" href="/language?cn"><span class="flag-icon flag-icon-background flag-icon-cn"></span></a>
            </div>
            <div class="col">
              <a class="" href="/language?ja"><span class="flag-icon flag-icon-background flag-icon-jp"></span></a>
            </div>
          </div> 
          <div class="row ml-2 mt-2">
            <div class="col">
              <a class="" href="/language?en"><span class="flag-icon flag-icon-background flag-icon-us"></span></a>
            </div>
            <div class="col">
            </div>
          </div>
        </div>
      </li>
      <li class="nav-item active" v-if="isAuthed === false">
        <a role="button" class="btn btn-warning btn-lg mr-lg-5" href="/edauth/signin" role="button">
          <i class="material-icons md-48">login</i>
        </a>
      </li>
      <li class="nav-item active" v-if="isAuthed === false ">
        <a role="button" class="btn btn-warning btn-lg" href="/edauth/signup" role="button">
          <i class="material-icons md-48">person_add</i>
        </a>
      </li>
      <li class="nav-item active" v-if="isAuthed === true">
        <a role="button" class="btn btn-warning btn-lg mr-lg-5" href="/edauth/profile" role="button">
          <i class="material-icons md-48">account_circle</i>
          <span class="badge badge-success">{{ name }}</spam>
        </a>
      </li>
      <li class="nav-item active" v-if="isAuthed === true">
        <a role="button" class="btn btn-warning btn-lg mr-lg-5" href="/edauth/signout" role="button">
          <i class="material-icons md-48">clear</i>
        </a>
      </li>
    </ul>
  </div>
`


$(document).ready( () => {
  const topNaveBar = Vue.createApp({});
  topNaveBar.component('w-navbar', {
    template: navbarTemplate,
    data: ()=>{
      const edauth = new EDAuth();
      const isAuthed = edauth.isAuthed();
      console.log('w-navbar::isAuthed=<',isAuthed,'>');
      const profile = edauth.getProfile();
      console.log('w-navbar::profile=<',profile,'>');
      return {
        isAuthed:isAuthed,
        name:profile.name
      };
    }    
  });
  console.log('w-navbar::topNaveBar=<',topNaveBar,'>');
  topNaveBar.mount('#vue-navbar-top');
  
});

$(function () {
  $('[data-toggle="popover"]').popover({html:true});
})
