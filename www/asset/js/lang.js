function onClickLanguage(lang) {
  console.log('lang=<' + lang + '>');
  if(lang) {
    localStorage.setItem('operation.lang',lang);
    updateLanguage();
  }
}
function updateLanguage() {
  let lang = localStorage.getItem('operation.lang')
  if(lang && typeof lang === 'string') {
    let elemLang = document.getElementById("nav.sec.login.lang");
    console.log('elemLang=<',elemLang,'>');
    if(elemLang) {
      elemLang.value = lang;
      console.log('elemLang.value=<',elemLang.value,'>');
    }
    //document.forms['secauth_navi_lang_form'].submit();
  }
}

