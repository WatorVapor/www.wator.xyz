document.addEventListener('DOMContentLoaded',(evt) =>{
  onDocumentReadyUI(evt);
});


const onDocumentReadyUI = (evt) =>{
  console.log('ui.evt::onDocumentReadyUI evt=<', evt,'>');
  onShowSearchLastHistory();
};


const onShowSearchLastHistory = ()=> {
  let historyText = getHistoryKeywords();
  if(!historyText) {
    historyText = '搜索';
  }
  const keywordsElement = document.getElementById('search-keywords-input-text');
  keywordsElement.value = historyText;

};


const LocalStorageSearchKeyWordFromIndex = 'wator/ermu/search/keyword4index';
const uiOnClickSearchIndex = (evt) => {
  //console.log('onMessageWSS::uiOnClickSearchIndex evt=<', evt,'>');
  //console.log('onMessageWSS::uiOnClickSearchIndex location.href=<', location.href,'>');
  const text = evt.parentElement.parentElement.getElementsByTagName('input')[0].value.trim();
  if(text) {
    const searchHref = location.href + 'search.html?words=' + text + '&begin=0&end=' + iConstOnePageResult;
    console.log('onMessageWSS::uiOnClickSearchIndex searchHref=<', searchHref,'>');
    localStorage.setItem(LocalStorageSearchKeyWordFromIndex,text);
    const searchMsg = { words:text,begin:0,end:iConstOnePageResult};
    localStorage.setItem(LocalStorageHistory,JSON.stringify(searchMsg));
    location.assign(searchHref);
  }
};

const uiOnClickSearch = (evt) => {
  //console.log('onMessageWSS::uiOnClickSearch evt=<', evt,'>');
  const text = evt.parentElement.parentElement.getElementsByTagName('input')[0].value.trim();
  //console.log('onMessageWSS::uiOnClickSearch text=<', text,'>');
  if(text) {
    const searchHref = replaceLocationSearchParams() + '?words=' + text + '&begin=0&end=' + iConstOnePageResult;
    console.log('onMessageWSS::uiOnClickSearchIndex searchHref=<', searchHref,'>');
    localStorage.setItem(LocalStorageSearchKeyWordFromIndex,text);
    const searchMsg = { words:text,begin:0,end:iConstOnePageResult};
    localStorage.setItem(LocalStorageHistory,JSON.stringify(searchMsg));
    location.assign(searchHref);
  }
};

const replaceLocationSearchParams = () =>{
  //console.log('onMessageWSS::replaceLocationSearchParams location.href=<', location.href,'>');  
  //console.log('onMessageWSS::replaceLocationSearchParams location.pathname=<', location.pathname,'>');
  const hrefArray = location.href.split(location.pathname);
  //console.log('onMessageWSS::replaceLocationSearchParams hrefArray=<', hrefArray,'>');
  return hrefArray[0] + location.pathname;
};

const openSearchURL = (word,pageIndex) => {
  const beginIndex = (pageIndex -1)* iConstOnePageResult;
  const endIndex = pageIndex * iConstOnePageResult;  
  //console.log('onMessageWSS::openSearchURL location.pathname=<', location.pathname,'>');
  //console.log('onMessageWSS::openSearchURL location.origin=<', location.origin,'>');
  const searchHref = `${location.origin}${location.pathname}?words=${word}&begin=${beginIndex}&end=${endIndex}`;
  //console.log('onMessageWSS::openSearchURL searchHref=<', searchHref,'>');
  localStorage.setItem(LocalStorageSearchKeyWordFromIndex,word);
  const searchMsg = { words:word,begin:beginIndex,end:endIndex};
  localStorage.setItem(LocalStorageHistory,JSON.stringify(searchMsg));
  location.assign(searchHref);  
}


const uiOnClickSearchNextPage = (elem) => {
  console.log(':uiOnClickSearchNextPage elem=<', elem,'>');
  const historyText = localStorage.getItem(LocalStorageHistory);
  const historyJson = JSON.parse(historyText);
  if(historyJson) {
    let pageIndex = parseInt(historyJson.begin) / iConstOnePageResult + 2;
    console.log('uiOnClickSearchNextPage pageIndex=<', pageIndex,'>');
    const text = localStorage.getItem(LocalStorageSearchKeyWordFromIndex);
    if(pageIndex > gTotalPageNumber) {
      pageIndex = gTotalPageNumber;
    }
    if(text && pageIndex) {
      openSearchURL(text,pageIndex);
    }
  }
};

const uiOnClickSearchPrevPage = (elem) => {
  console.log('uiOnClickSearchPrevPage elem=<', elem,'>');
  const historyText = localStorage.getItem(LocalStorageHistory);
  const historyJson = JSON.parse(historyText);
  if(historyJson) {
    let pageIndex = parseInt(historyJson.begin) / iConstOnePageResult;
    console.log('uiOnClickSearchPrevPage pageIndex=<', pageIndex,'>');
    const text = localStorage.getItem(LocalStorageSearchKeyWordFromIndex);
    if(pageIndex < 1) {
      pageIndex = 1;
    }
    if(text && pageIndex) {
      openSearchURL(text,pageIndex);
    }
  }
};

const uiOnClickSearchGoToPage = (elem) => {
  //console.log('uiOnClickSearchGoToPage elem=<', elem,'>');
  const pageNumText = elem.getElementsByTagName('span')[0].textContent;
  //console.log('uiOnClickSearchGoToPage pageNumText=<', pageNumText,'>');
  const pageNum = parseInt(pageNumText);
  //console.log('uiOnClickSearchGoToPage pageNum=<', pageNum,'>');
  const text = localStorage.getItem(LocalStorageSearchKeyWordFromIndex);
  if(text && pageNum) {
    openSearchURL(text,pageNum);
  }
};
