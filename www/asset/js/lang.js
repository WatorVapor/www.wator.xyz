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

const constKeyLanguangeCode = 'lang_code';

$(document).ready( async () => {
  let lang = localStorage.getItem(constKeyLanguangeCode);
  if(!lang) {
    lang = 'cn';
  }
  //console.log('::lang=<',lang,'>');
  const langURL = `${location.pathname}lang_${lang}.js`;
  //console.log('::langURL=<',langURL,'>');
  const dataPromise = import(langURL);
  const langModule = await dataPromise;
  //console.log('::langModule.data=<',langModule.data,'>');
  const topLanguage = new Vue({
    el: '#vue-lang-top',
    data: langModule.data
  });
  //console.log('::topLanguage=<',topLanguage,'>');
});

