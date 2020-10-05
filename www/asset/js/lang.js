const constKeyLanguangeCode = 'lang_code';
document.addEventListener('DOMContentLoaded', async (evt) => {
  let lang = localStorage.getItem(constKeyLanguangeCode);
  if(!lang) {
    lang = 'cn';
  }
  //console.log('::lang=<',lang,'>');
  const langURL = `${location.pathname}lang_${lang}.js`;
  //console.log('::langURL=<',langURL,'>');
  const langPromise = import(langURL);
  const langModule = await langPromise;
  //console.log('::langModule.data=<',langModule.data,'>');
  const langElem = document.querySelectorAll('.vue-lang');
  langElem.forEach((el, i) => {
    const app = Vue.createApp({
      data() {
        return langModule.data;
      }     
    });
    app.mount(el);
  });
});
