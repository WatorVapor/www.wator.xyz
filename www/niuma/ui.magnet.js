document.addEventListener('DOMContentLoaded',()=>{
  createMagnetChart();
})

let gLastUpdate = new Date();
const gMagnetX = [];
const gMagnetY = [];
const gMagnetZ = [];

const onBLEDataMagnet = (magnet) => {
  //console.log('::onBLEDataMagnet::magnet=<',magnet,'>');
  if(typeof magnet.mx !== 'undefined') {
    gMagnetX.push(magnet.mx);
    delete gMagnetX.shift();
  }
  if(typeof magnet.my !== 'undefined') {
    gMagnetY.push(magnet.my);
    delete gMagnetY.shift();    
  }
  if(typeof magnet.mz !== 'undefined') {
    gMagnetZ.push(magnet.mz);
    delete gMagnetZ.shift();
  }
  
  if(magnet_chart) {
    const diff = new Date() -gLastUpdate;
    if(diff > 100) {
      //console.log('::onBLEDataMagnet::gMagnetData.datasets=<',gMagnetData.datasets,'>');
      gMagnetData.datasets[0].data = gMagnetX.slice();
      gMagnetData.datasets[1].data = gMagnetY.slice();
      gMagnetData.datasets[2].data = gMagnetZ.slice();
      gLastUpdate =  new Date();
      magnet_chart.update();
    }
  }
}
const gMagnetData = {
  labels:[],
  datasets:[
    {
      label: 'magnetX',
      pointRadius:0.5,
      pointHoverRadius: 0.5,
      data: [],
      borderColor: 'red'
    },
    {
      label: 'magnetY',
      pointRadius:0.5,
      pointHoverRadius: 0.5,
      data: [],
      borderColor: 'green'
    },
    {
      label: 'magnetZ',
      pointRadius:0.5,
      pointHoverRadius: 0.5,
      data: [],
      borderColor: 'blue'
    }
  ]
};
const iConstDataLength = 256;
let magnet_chart = false;
const createMagnetChart = () => {
  const ctx = document.getElementById('magnet_chart').getContext('2d');
  const options = {
  };
  for(let i = 1;i <= iConstDataLength;i++) {
    gMagnetData.labels.push(i);
    gMagnetX.push(0.0);
    gMagnetY.push(0.0);
    gMagnetZ.push(0.0);
    gMagnetData.datasets[0].data.push(0.0);
    gMagnetData.datasets[1].data.push(0.0);
    gMagnetData.datasets[2].data.push(0.0);
  }
  magnet_chart = new Chart(ctx, {
    type: 'line',
    data: gMagnetData,
    options: options
  });
}
