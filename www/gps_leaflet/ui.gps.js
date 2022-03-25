const lineWorker = new Worker('read.line.js',{ type: 'module' });
lineWorker.addEventListener('message', (e) =>{
  //console.log('lineWorker.addEventListener::e:=<',e,'>');
  //console.log('lineWorker.addEventListener::typeof e.data:=<',typeof e.data,'>');
  if(typeof e.data === 'string') {
    onSerialDataLine(e.data);
  }
})

const uiOnClickOpenGpsDevice = async (elem) => {
  console.log('uiOnClickOpenGpsDevice::elem:=<',elem,'>');
  const port = await navigator.serial.requestPort();
  console.log('uiOnClickOpenGpsDevice::port:=<',port,'>');
  await port.open({ baudRate: 115200 });
  console.log('uiOnClickOpenGpsDevice::port:=<',port,'>');
  setTimeout(()=>{
    readDateFromGpsDevice(port);
  },10)
}
let gSeiralReadTextBufferTail = '';
const readDateFromGpsDevice = async (port)=> {
  if(port.readable) {
    const reader = port.readable.getReader();
    let value, done;
    try {
      ({ value, done } = await reader.read());
      //console.log('uiOnClickOpenGpsDevice::done:=<',done,'>');
      //console.log('uiOnClickOpenGpsDevice::value:=<',value,'>');
      if(value) {
        lineWorker.postMessage(value);
      }
    } catch (error) {
      console.log('readDateFromGpsDevice::error:=<',error,'>');
    }
    await reader.releaseLock();
    setTimeout(()=>{
      readDateFromGpsDevice(port);
    },10);
  }
}

const gGPS = new GPS();
gGPS.on('data', data => {
  //console.log('gGPS::data:=<',data,'>');
  if(data.type === 'GGA') {
    console.log('gGPS::data:=<',data,'>');
    updateMap(data.lat,data.lon);
  }
});
const onSerialDataLine = (textLine)=> {
  //console.log('onSerialDataLine::textLine:=<',textLine,'>');
  try {
    gGPS.update(textLine);
  } catch(err) {
    // ...
  }
}

document.addEventListener('DOMContentLoaded', async (evt) => {
  createMapView(0.0,0.0);
});

let gGPSMap = false;
const createMapView = (lat,lon) => {
  gGPSMap = L.map('view_map',{
    center: [lat, lon],
    zoom:19,
    maxNativeZoom: 19
  });
  const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
  });
/*  
  const tileLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
    attribution: "<a href='https://developers.google.com/maps/documentation' target='_blank'>Google Map</a>"
  });
*/
  tileLayer.addTo(gGPSMap);
  
}

let gGPSMapCenterOfRealGps = false;
const updateMap = (lat,lon) => {
  if(gGPSMapCenterOfRealGps === false) {
    gGPSMap.panTo(new L.LatLng(lat, lon))
    gGPSMapCenterOfRealGps = true;
  }
  L.marker(new L.LatLng(lat,lon)).bindPopup('+').addTo(gGPSMap); 
  //
}


