self.addEventListener('message', function(e) {
  self.postMessage(e.data);
  //console.log('addEventListener::e.data:=<',e.data,'>');
  onSplitData2Lines(e.data);
}, false);
let gSeiralReadTextBufferTail = '';
const onSplitData2Lines = (value) => {
  //console.log('onSplitData2Lines::value:=<',value,'>');
  const textValue = new TextDecoder().decode(value);
  //console.log('onSplitData2Lines::textValue:=<',textValue,'>');
  const textLines = (gSeiralReadTextBufferTail+textValue).split('\r\n');
  //console.log('uiOnClickOpenGpsDevice::textLines:=<',textLines,'>');
  for(let index = 0;index < textLines.length -1 ;index++) {
    onDataLine(textLines[index]);
  }
  if(textLines.length >0) {
    const lastText = textLines[textLines.length -1];
    if(lastText) {
      gSeiralReadTextBufferTail = lastText;
    }
  } else {
    gSeiralReadTextBufferTail = '';
  }
  //console.log('uiOnClickOpenGpsDevice::gSeiralReadTextBufferTail:=<',gSeiralReadTextBufferTail,'>');
}

const onDataLine = (textLine)=> {
  //console.log('onDataLine::textLine:=<',textLine,'>');
  const gpsLines = textLine.split('$');
  for(const gpsline of gpsLines) {
    //console.log('onDataLine::gpsline:=<',gpsline,'>');
    if(gpsline) {
      self.postMessage('$' + gpsline);
    }
  }
}
