const gResultPages = [];
let gResultPagesApp = false;
let gTotalPage = 0;

let gShowResultsPages = [];

let gCurrentViewPageInext = 0;
const searchMsg = getHistory();
if(searchMsg) {
  gCurrentViewPageIndex = searchMsg.begin /iConstOnePageResult;
}
if(gCurrentViewPageIndex < 0) {
  gCurrentViewPageIndex  = 0;
}

let gResultTotalApp = false;


const onShowStatsResultApp = (msg) =>{
  //console.log('ui.vue::onShowStatsResultApp msg=<', msg,'>');
  while(gResultPages.length > 0) {
      gResultPages.pop();
  }
  const totalPage = Math.ceil(parseInt(msg.total)/iConstOnePageResult);
  for(let page = 1;page <= totalPage;page++) {
    gResultPages.push({number:page,isView:false});
  }
  console.log('ui.vue::onShowStatsResultApp gResultPages=<', gResultPages,'>');
  if(gResultPages[gCurrentViewPageIndex]) {
    gResultPages[gCurrentViewPageIndex].isView = true;
  }
  //console.log('ui.vue::onShowStatsResultApp gCurrentViewPageIndex=<', gCurrentViewPageIndex,'>');
  let startOffset = gCurrentViewPageIndex-5;
  if(startOffset < 0) {
    startOffset = 0;
  }
  gShowResultsPages = gResultPages.slice(startOffset, startOffset + 10);
  //console.log('ui.vue::onShowStatsResultApp gShowResultsPages=<', gShowResultsPages,'>');
  gTotalPage = parseInt(msg.total);
  //console.log('ui.vue::onShowStatsResultApp gTotalPage=<', gTotalPage,'>');
  if(gResultPagesApp === false) {
    gResultPagesApp = new Vue({
      el: '#vue-ui-app-pages-nav-result',
      data: {
        pages: gShowResultsPages
      }
    });    
  } else {
    console.log('ui.vue::onShowStatsResultApp gResultPagesApp=<', gResultPagesApp,'>');
  }

  if(gResultTotalApp === false) {
    gResultTotalApp = new Vue({
      el: '#vue-ui-app-pages-total-result',
      data: {
        total:gTotalPage
      }
    });    
  } else {
    //console.log('ui.vue::onShowStatsResultApp gResultTotalApp=<', gResultTotalApp,'>');
    if(gTotalPage > gResultTotalApp.total) {
      gResultTotalApp.total = gTotalPage;
    }
  }  
  $('#vue-ui-app-pages-total-result').removeClass("d-none");
  $('#vue-ui-app-pages-nav-result').removeClass("d-none");
  $('#search-progress-spinner').addClass("d-none");  
}



const gResultFrameRows = [];
let gResultFrameRowsApp = false;

const onShowSearchResultFrameRow = (cid) => {
  //console.log('ui.vue::onShowSearchResultFrameRow cid=<', cid,'>');
  const idElem = {
    spinner:'spinner-' + cid,
    frame:'frame-' + cid,
    title:'title-' + cid,
    freq:'freq-' + cid,
    href:'href-' + cid,
    summary:'summary-' + cid
  };
  gResultFrameRows.push(idElem);
  if(gResultFrameRowsApp === false) {
    gResultFrameRowsApp = new Vue({
      el: '#vue-ui-app-rows-result-frame',
      data: {
        searchResultCIDRows: gResultFrameRows
      }
    });    
  }
  $('#vue-ui-app-rows-result-frame').removeClass("d-none");
}


const onShowSearchResultOneRow = (cid,result) => {
  //console.log('ui.vue::onShowSearchResultOneRow cid=<', cid,'>');
  //console.log('ui.vue::onShowSearchResultOneRow result=<', result,'>');
  const contentJ = result;
  const summaryArray = contentJ.summary.split(contentJ.word);
  //console.log('ui.vue::onShowTopResultApp summaryArray=<', summaryArray,'>');
  let summaryColor = '';
  for(const sumClip of summaryArray) {
    summaryColor += sumClip;
    summaryColor += '<span class="text-danger">';
    summaryColor += contentJ.word;
    summaryColor += '</span>';
  }
  const frameid = '#frame-' + cid;
  //console.log('ui.vue::onShowSearchResultOneRow frameid=<', frameid,'>');
  $(frameid).removeClass("d-none");
  const spinnerid = '#spinner-' + cid;
  //console.log('ui.vue::onShowSearchResultOneRow spinnerid=<', spinnerid,'>');
  $(spinnerid).addClass("d-none");
  
  const freqid = '#freq-' + cid;
  //console.log('ui.vue::onShowSearchResultOneRow freqid=<', freqid,'>');
  $(freqid).text(contentJ.freq);
  
  const titleid = '#title-' + cid;
  //console.log('ui.vue::onShowSearchResultOneRow titleid=<', titleid,'>');
  let tiltle = contentJ.title;
  if(!tiltle) {
    tiltle = contentJ.href;
  }
  $(titleid).text(tiltle);
  
  const hrefid = '#href-' + cid;
  //console.log('ui.vue::onShowSearchResultOneRow hrefid=<', hrefid,'>');
  $(hrefid).attr('href',contentJ.href);
  
  const summaryid = '#summary-' + cid;
  //console.log('ui.vue::onShowSearchResultOneRow summaryid=<', summaryid,'>');
  $(summaryid).html(summaryColor);  
}
