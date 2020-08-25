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

const iConstFilterOut = 8;

const forward = (layer,mat) => {
  console.log('forward:layer:=<',layer,'>');
  console.log('forward::mat.cols:=<',mat.cols,'>');
  console.log('forward::mat.rows:=<',mat.rows,'>');
  console.log('forward::mat.depth:=<',mat.depth(),'>');
  console.log('forward::mat.channels:=<',mat.channels(),'>');
  console.log('forward::mat.type:=<',mat.type(),'>');
  /// grid
  const allVals = []
  for(let col = 0;col < mat.cols - layer.grid.x; col += layer.grid.x) {
    for(let row = 0;row < mat.rows - layer.grid.y; row += layer.grid.y) {
      //console.log('forward::col:=<',col,'>');
      //console.log('forward::row:=<',row,'>');
      const mixVal = onGridData(layer,mat,col,row);
      allVals.push({v:mixVal,r:row,c:col});
    }
  }
  //onLoadStats(allVals);
  
  allVals.sort((a,b)=>{ return b.v - a.v;});
  //console.log('forward::allVals:=<',allVals,'>');
  const end = allVals.length/iConstFilterOut;
  const outVals = allVals.slice(0,end);
  //console.log('forward::outVals:=<',outVals,'>');
  let matOut = new cv.Mat.zeros(mat.rows/3,mat.cols/3, mat.type());
//  console.log('forward::matOut:=<',matOut,'>');



  for(const value of outVals) {
    //console.log('forward::value:=<',value,'>');
    //console.log('forward::pixel:=<',pixel,'>');
    const row = value.r/layer.grid.y;
    const col = value.c/layer.grid.x;
    matOut.ucharPtr(row, col)[0] = 254;
    matOut.ucharPtr(row, col)[1] = 0;
    matOut.ucharPtr(row, col)[2] = 0;
    matOut.ucharPtr(row, col)[3] = 254;
    //console.log('forward:: matOut.ucharPtr(value.r, value.c):=<', matOut.ucharPtr(value.r, value.c),'>');
  }
  const outElement = document.getElementById('img_output');
  cv.imshow(outElement, matOut);

  const start = allVals.length - allVals.length/iConstFilterOut;
  const outValsB = allVals.slice(start);
  let matOutB = new cv.Mat.zeros(mat.rows/3,mat.cols/3, mat.type());
//  console.log('forward::matOutB:=<',matOutB,'>');

  for(const value of outValsB) {
    //console.log('forward::value:=<',value,'>');
    //console.log('forward::pixel:=<',pixel,'>');
    const row = value.r/layer.grid.y;
    const col = value.c/layer.grid.x;
    matOutB.ucharPtr(row, col)[0] = 254;
    matOutB.ucharPtr(row, col)[1] = 0;
    matOutB.ucharPtr(row, col)[2] = 0;
    matOutB.ucharPtr(row, col)[3] = 254;
    //console.log('forward:: matOutB.ucharPtr(value.r, value.c):=<', matOutB.ucharPtr(value.r, value.c),'>');
  }
  const outElementB = document.getElementById('img_output_b');
  cv.imshow(outElementB, matOutB);

}

const onGridData = (layer,mat,col,row) => {
  let R11 = mat.ucharAt(row, col * mat.channels());
  //console.log('forward::R11:=<',R11,'>');
  let R12 = mat.ucharAt(row, (col+1) * mat.channels());
  //console.log('forward::R12:=<',R12,'>');
  let R13 = mat.ucharAt(row, (col+2) * mat.channels());
  //console.log('forward::R13:=<',R13,'>');
  let R21 = mat.ucharAt(row+1, col * mat.channels());
  //console.log('forward::R21:=<',R21,'>');
  let R22 = mat.ucharAt(row+1, (col+1) * mat.channels());
  //console.log('forward::R22:=<',R22,'>');
  let R23 = mat.ucharAt(row+1, (col+2) * mat.channels());
  //console.log('forward::R23:=<',R23,'>');
  let R31 = mat.ucharAt(row+2, col * mat.channels());
  //console.log('forward::R31:=<',R31,'>');
  let R32 = mat.ucharAt(row+2, (col+1) * mat.channels());
  //console.log('forward::R32:=<',R32,'>');
  let R33 = mat.ucharAt(row+2, (col+2) * mat.channels());
  //console.log('forward::R33:=<',R33,'>');
  let fVal1 = 0.0;
  fVal1 += R11 * layer.weight.filter1[0];
  fVal1 += R12 * layer.weight.filter1[1];
  fVal1 += R13 * layer.weight.filter1[2];
  fVal1 += R21 * layer.weight.filter1[3];
  fVal1 += R22 * layer.weight.filter1[4];
  fVal1 += R23 * layer.weight.filter1[5];
  fVal1 += R31 * layer.weight.filter1[6];
  fVal1 += R32 * layer.weight.filter1[7];
  fVal1 += R33 * layer.weight.filter1[8];
  //console.log('forward::fVal1:=<',fVal1,'>');
  return fVal1;
}

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
 
