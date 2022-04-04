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
  console.log('gGPS::data:=<',data,'>');
  if(data.type === 'GGA') {
    //console.log('gGPS::data:=<',data,'>');
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
  const layer =  new ol.layer.Tile({
    source: new ol.source.OSM()
  });
  const view = new ol.View({
    center: ol.proj.fromLonLat([lat, lon]),
    zoom: 20
  })  
  const mapOption = {
    target: 'view_map',
    layers: [
      layer
    ],
    view: view
  };
  gGPSMap = new ol.Map(mapOption);
}

let gGPSMapCenterOfRealGps = false;
const updateMap = (lat,lon) => {
  if(gGPSMapCenterOfRealGps === false) {
    gGPSMap.getView().setCenter(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'));
    gGPSMapCenterOfRealGps = true;
  }
  const layerMarker = new ol.layer.Vector({
       source: new ol.source.Vector({
           features: [
               new ol.Feature({
                   geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat]))
               })
           ]
       })
   });
  gGPSMap.addLayer(layerMarker);  
}


