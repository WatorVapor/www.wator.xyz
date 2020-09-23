const LocalStorageHistory = 'wator/ermu/history';
const LocalStorageSearchKeyWordFromIndex = 'wator/ermu/search/keyword4index';
const iConstOnePageResult = 16;

document.addEventListener('DOMContentLoaded',(evt) =>{
  onDocumentReadyUI(evt);
});

const onDocumentReadyUI = (evt) =>{
  //console.log('ui.evt::onDocumentReadyUI evt=<', evt,'>');
  const historyOfSearch = {
    data() {
      let historyText = getHistoryKeywords();
      if(!historyText) {
        historyText = '搜索';
      }
      return {
        history: historyText
      }
    }
  }
  const searchEntry = Vue.createApp(historyOfSearch);
  searchEntry.mount('#ui-search-input-entry');
};


const uiOnClickJumpToSearch = (evt) => {
  //console.log('uiOnClickJumpToSearch evt=<', evt,'>');
  //console.log('uiOnClickJumpToSearch location.href=<', location.href,'>');
  const text = evt.parentElement.parentElement.getElementsByTagName('input')[0].value.trim();
  if(text) {
    const searchHref = location.href + 'search?words=' + text + '&begin=0&end=' + iConstOnePageResult;
    //console.log('uiOnClickJumpToSearch searchHref=<', searchHref,'>');
    localStorage.setItem(LocalStorageSearchKeyWordFromIndex,text);
    const searchMsg = { words:text,begin:0,end:iConstOnePageResult};
    localStorage.setItem(LocalStorageHistory,JSON.stringify(searchMsg));
    location.assign(searchHref);
  }
};

const getHistoryKeywords = () => {
  const historyStr = localStorage.getItem(LocalStorageHistory);
  try {
    const historyJson = JSON.parse(historyStr);
    //console.log('onMessageWSS::getHistoryKeywords historyJson=<', historyJson,'>');
    return historyJson.words;
  } catch(e) {
    console.log('onMessageWSS::getHistoryKeywords e=<', e,'>');
  }
  return null;
};
