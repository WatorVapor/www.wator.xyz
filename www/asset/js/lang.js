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

