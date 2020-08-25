const onOpenCvReady = ()=> {
  cv['onRuntimeInitialized'] = onOpenCvRTReady ;
}

const onOpenCvRTReady = () => {
  const imgElement = document.getElementById('img_input');
  const mat = cv.imread(imgElement);
  onImageMat(mat);
}

onImageMat = (mat) => {
  forward(Layer1,mat);
}

const f1 = 1.0;
const f1_ = -1.0;

const f1_8 = 1.0/8.0;
const f1_8_ = - 1.0/8.0;

const Layer1 = {
  grid:{
    x:3,
    y:3
  },
  weight:{
    filter1:[
     f1_8_,f1_8_,f1_8_,
     f1_8_,f1,f1_8_,
     f1_8_,f1_8_,f1_8_
    ]
  }
};

const iConstFilterOut = 16;

const forward = (layer,mat) => {
  console.log('forward:layer:=<',layer,'>');
  console.log('forward::mat.cols:=<',mat.cols,'>');
  console.log('forward::mat.rows:=<',mat.rows,'>');
  console.log('forward::mat.depth:=<',mat.depth(),'>');
  console.log('forward::mat.channels:=<',mat.channels(),'>');
  console.log('forward::mat.type:=<',mat.type(),'>');
  /// grid
  const allVals = {R:[],G:[],B:[]};
  for(let col = 0;col < mat.cols - layer.grid.x; col += layer.grid.x) {
    for(let row = 0;row < mat.rows - layer.grid.y; row += layer.grid.y) {
      //console.log('forward::col:=<',col,'>');
      //console.log('forward::row:=<',row,'>');
      const mixVal = onGridData(layer,mat,col,row);
      allVals.R.push({v:mixVal.R,r:row,c:col});
      allVals.G.push({v:mixVal.G,r:row,c:col});
      allVals.B.push({v:mixVal.B,r:row,c:col});
    }
  }
  //onLoadStats(allVals);
  showOutData(allVals.R,mat,layer,'img_output_r',0);
  showOutData(allVals.G,mat,layer,'img_output_g',1);
  showOutData(allVals.B,mat,layer,'img_output_b',2);
}



const onGridData = (layer,mat,col,row) => {
  const  fVal = {R:0.0,G:00,B:0.0};
  for(let rowI = 0;rowI < layer.grid.y;rowI++) {
    for(let colI = 0;colI < layer.grid.x;colI++) {
      const R = mat.ucharAt(row + rowI, (col +colI) * mat.channels());
      const G = mat.ucharAt(row + rowI, (col +colI) * mat.channels() +1);
      const B = mat.ucharAt(row + rowI, (col +colI) * mat.channels() +2);
      const A = mat.ucharAt(row + rowI, (col +colI) * mat.channels() +3);
      const wIndex = rowI * layer.grid.x + colI;
      fVal.R += R * layer.weight.filter1[wIndex];;
      fVal.G += G * layer.weight.filter1[wIndex];;
      fVal.B += B * layer.weight.filter1[wIndex];;
    }
  }
  return fVal;
}

const showOutData = (outChannelVals,mat,layer,elemId,channel) => {
  outChannelVals.sort((a,b)=>{ return b.v - a.v;});
  //console.log('forward::outChannelVals:=<',outChannelVals,'>');
  const end = outChannelVals.length/iConstFilterOut;
  const outVals = outChannelVals.slice(0,end);
  //console.log('forward::outVals:=<',outVals,'>');
  let matOut = new cv.Mat.zeros(mat.rows/layer.grid.y,mat.cols/layer.grid.x, mat.type());
//  console.log('forward::matOut:=<',matOut,'>');



  for(const value of outVals) {
    //console.log('forward::value:=<',value,'>');
    //console.log('forward::pixel:=<',pixel,'>');
    const row = value.r/layer.grid.y;
    const col = value.c/layer.grid.x;
    if(channel === 0) {
      matOut.ucharPtr(row, col)[0] = 254;
      matOut.ucharPtr(row, col)[1] = 0;
      matOut.ucharPtr(row, col)[2] = 0;
    }
    if(channel === 1) {
      matOut.ucharPtr(row, col)[0] = 0;
      matOut.ucharPtr(row, col)[1] = 254;
      matOut.ucharPtr(row, col)[2] = 0;
    }
    if(channel === 2) {
      matOut.ucharPtr(row, col)[0] = 0;
      matOut.ucharPtr(row, col)[1] = 0;
      matOut.ucharPtr(row, col)[2] = 254;
    }
    matOut.ucharPtr(row, col)[3] = 254;
    //console.log('forward:: matOut.ucharPtr(value.r, value.c):=<', matOut.ucharPtr(value.r, value.c),'>');
  }
  const outElement = document.getElementById(elemId);
  cv.imshow(outElement, matOut);

  const start = outChannelVals.length - outChannelVals.length/iConstFilterOut;
  const outValsB = outChannelVals.slice(start);
  let matOutB = new cv.Mat.zeros(mat.rows/layer.grid.y,mat.cols/layer.grid.x, mat.type());
//  console.log('forward::matOutB:=<',matOutB,'>');

  for(const value of outValsB) {
    //console.log('forward::value:=<',value,'>');
    //console.log('forward::pixel:=<',pixel,'>');
    const row = value.r/layer.grid.y;
    const col = value.c/layer.grid.x;
    if(channel === 0) {
      matOutB.ucharPtr(row, col)[0] = 254;
      matOutB.ucharPtr(row, col)[1] = 0;
      matOutB.ucharPtr(row, col)[2] = 0;
    }
    if(channel === 1) {
      matOutB.ucharPtr(row, col)[0] = 0;
      matOutB.ucharPtr(row, col)[1] = 254;
      matOutB.ucharPtr(row, col)[2] = 0;
    }
    if(channel === 2) {
      matOutB.ucharPtr(row, col)[0] = 0;
      matOutB.ucharPtr(row, col)[1] = 0;
      matOutB.ucharPtr(row, col)[2] = 254;
    }
    matOutB.ucharPtr(row, col)[3] = 254;
    //console.log('forward:: matOutB.ucharPtr(value.r, value.c):=<', matOutB.ucharPtr(value.r, value.c),'>');
  }
  const outElementB = document.getElementById(elemId + '_l');
  cv.imshow(outElementB, matOutB);  
};


const onLoadStats = (data) => {
  const ctx = document.getElementById('canvas').getContext('2d');
  const scatterChartData = {
    datasets: [{
      label: 'My First dataset',
      borderColor: 'red',
      data: []
    }]
  };    
  for(const value of data) {
    scatterChartData.datasets[0].data.push({y:value,x:1});
  }
  const chart = Chart.Scatter(ctx, {
    data: scatterChartData,
    options: {
      title: {
        display: true,
        text: 'Chart.js Scatter Chart'
      },
      scales: {
        yAxes: [ 
          {
            ticks: {
              steps: 0.001,
            }
          }
        ]
      }
    }
  });
}
 
