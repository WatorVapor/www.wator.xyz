/*
<script src="https://cdn.jsdelivr.net/npm/vue@3.2.37/dist/vue.esm-browser.js" integrity="sha256-0HluxIHcrW83wmxrIfSpv1SQlx6fAOcuzsWv56qKxJ0=" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/vue@3.2.37/dist/vue.esm-browser.prod.js" integrity="sha256-9hkLUYH+c9hqvwfekYBHX2Oz+DRCJgSnS+wSwrF7mVw=" crossorigin="anonymous"></script>
*/
import * as Vue from 'https://cdn.jsdelivr.net/npm/vue@3.2.37/dist/vue.esm-browser.prod.js';
const createCounterApp = async ()=> {
  const templateResp = await fetch('/vue_component/component/counter2.html');
  //console.log('::createCounterApp:templateResp:=<',templateResp,'>');
  const templateCounter = await templateResp.text();
  //console.log('::createCounterApp:templateCounter:=<',templateCounter,'>');
  const counterAppOption = {
    data() {
     return {
       counter: 0
     };
    },
    mounted() {
      setInterval(() => {
        this.counter++
      }, 1000)
    }, 
    template:templateCounter
  };
  const counterApp = Vue.createApp(counterAppOption);
  counterApp.component('counter2-app',counterAppOption);
  //console.log('::createCounterApp:counterApp:=<',counterApp,'>');
  return counterApp;
}

document.addEventListener('DOMContentLoaded',async (evt)=>{
  //console.log('::DOMContentLoaded:evt:=<',evt,'>');
  const app = await createCounterApp();
  const vm = app.mount('#counter2')
  //console.log('::DOMContentLoaded:vm:=<',vm,'>');
});

