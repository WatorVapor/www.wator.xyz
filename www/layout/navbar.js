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
    <!--
      <li class="nav-item active ml-lg-4">
        <a class="btn btn-lg btn-primary nav-btn" href="/ethereum" role="button">
          <img src="/asset/images/ethereum/ethereum_icon.png" />
        </a>
      </li>
    -->
    </ul>
    <!--
    <ul class="navbar-nav justify-content-center">
      <li class="nav-item active">
        <a class="btn btn-lg btn-primary nav-btn" href="/" role="button">
          <i class="material-icons md-48">help</i>
        </a>
      </li>
      <li class="nav-item active ml-lg-3">
        <a class="btn btn-lg btn-primary nav-btn" href="/about" role="button">
          <i class="material-icons md-48">settings</i>
        </a>
      </li>
    </ul>
    -->
    <ul class="navbar-nav nav justify-content-end">
      <li class="nav-item active mr-lg-5">
        <a tabindex="1" href="#" class="btn btn-lg btn-success nav-btn" data-container="body" data-html="true" data-trigger="focus" data-toggle="popover" data-placement="bottom" data-content="&lt;div class=&quot;row justify-content-around mt-lg-3 ml-lg-4 mr-lg-4&quot;&gt;&lt;a class=&quot;btn btn-lg btn-success mr-lg-5&quot; href=&quot;/starbian&quot; role=&quot;button&quot;&gt;&lt;i class=&quot;material-icons md-48&quot;&gt;device_hub&lt;/i&gt;&lt;/a&gt;&lt;a class=&quot;btn btn-lg btn-success disabled&quot; href=&quot;/scope&quot; role=&quot;button&quot;&gt;&lt;i class=&quot;material-icons md-48&quot;&gt;photo&lt;/i&gt;&lt;/a&gt;&lt;/div&gt;&lt;hr/&gt;&lt;div class=&quot;row justify-content-around mt-lg-3 ml-lg-4 mr-lg-4&quot;&gt;&lt;a class=&quot;btn btn-lg btn-success mr-lg-5 &quot; href=&quot;/wai&quot; role=&quot;button&quot;&gt;&lt;i class=&quot;material-icons md-48&quot;&gt;mic&lt;/i&gt;&lt;/a&gt;&lt;a class=&quot;btn btn-lg btn-success &quot; href=&quot;/story&quot; role=&quot;button&quot;&gt;&lt;i class=&quot;material-icons md-48&quot;&gt;book&lt;/i&gt;&lt;/a&gt;&lt;/div&gt;">
          <i class="material-icons md-48">apps</i>
        </a>
      </li>
      <li class="nav-item active mr-lg-5">
        <a tabindex="0" href="#" class="btn btn-lg btn-success nav-btn" data-container="body" data-html="true" data-trigger="focus" data-toggle="popover" data-placement="bottom" data-content="&lt;div class=&quot;row justify-content-around mt-lg-3 ml-lg-3 mr-lg-3&quot;&gt;&lt;a class=&quot;btn btn-success mr-lg-5&quot; href=&quot;/clicklang/zh&quot; role=&quot;button&quot;&gt;&lt;span class=&quot;flag-icon flag-icon-background flag-icon-cn&quot;&gt;&lt;/span&gt;&lt;/a&gt;&lt;a class=&quot;btn btn-success &quot; href=&quot;/clicklang/ja&quot; role=&quot;button&quot;&gt;&lt;span class=&quot;flag-icon flag-icon-background flag-icon-jp&quot;&gt;&lt;/span&gt;&lt;/a&gt;&lt;/div&gt;&lt;div class=&quot;row justify-content-around mt-lg-5 ml-lg-3 mr-lg-3 mb-lg-3&quot;&gt;&lt;a class=&quot;btn btn-success mr-lg-5&quot; href=&quot;/clicklang/en&quot; role=&quot;button&quot;&gt;&lt;span class=&quot;flag-icon flag-icon-background flag-icon-us&quot;&gt;&lt;/span&gt;&lt;/a&gt;&lt;a class=&quot;btn btn-success &quot; href=&quot;/clicklang/ru&quot; role=&quot;button&quot;&gt;&lt;span class=&quot;flag-icon flag-icon-background flag-icon-ru&quot;&gt;&lt;/span&gt;&lt;/a&gt;&lt;/div&gt;">
          <i class="material-icons md-48">language</i>
        </a>
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

    <form  id="secauth_navi_lang_form" class="mt-2 mb-2 d-none" method="POST" action="/secauth/language">
      <button type="submit" class="btn btn-success btn-block mb-3">
        <spam>登录</span>
        <i class="material-icons " style="color:green;">done</i>
      </button>
      <input type="hidden" name="_token" value="6vscVaCzJlBzz1lJBHJMbNoWt9H1gTcY9DK49Ap4">
      <div class="form-group text-left">
        <span class="input-group-text">语言</span>
        <textarea type="text" id="nav.sec.login.lang" name="lang" class="form-control" cols="40" rows="1"></textarea>
      </div>
    </form>

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
