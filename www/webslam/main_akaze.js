const onOpenCvReady = ()=> {
  cv['onRuntimeInitialized'] = onOpenCvRTReady ;
}

const onOpenCvRTReady = () => {
  const imgElement1 = document.getElementById('img_input-1');
  const mat1 = cv.imread(imgElement1);
  const imgElement2 = document.getElementById('img_input-2');
  const mat2 = cv.imread(imgElement2);
  onImageMatStero(mat1,mat2);
}

const onImageMatStero = (mat1,mat2) => {
  console.log('onImageMatStero:mat1:=<',mat1,'>');
  console.log('onImageMatStero:mat2:=<',mat2,'>');
  const akaze  = new cv.AKAZE();
  console.log('onImageMatStero:akaze:=<',akaze,'>');
  const mask = new cv.Mat();
  const kp1 = new cv.KeyPointVector();
  const des1 = new cv.Mat();
  const kp2 = new cv.KeyPointVector();
  const des2 = new cv.Mat();
  akaze.detectAndCompute(mat1, mask, kp1, des1, false);
  akaze.detectAndCompute(mat2, mask, kp2, des2, false);
  const matches = new cv.DMatchVectorVector();
  const bf = new cv.BFMatcher(2, false);
  bf.knnMatch(des1, des2, matches, 2, mask, false);
  const ratio = .5;
  const good = new cv.DMatchVectorVector();
  for (let i = 0; i < matches.size(); i++) {
    const m = matches.get(i).get(0), n = matches.get(i).get(1);
    if (m.distance < ratio * n.distance) {
      const t = new cv.DMatchVector();
      t.push_back(m);
      good.push_back(t);
    }
  }
  console.log('onImageMatStero:good:=<',good,'>');
  const matchingImage = new cv.Mat();
  const mc = new cv.Scalar(-1, -1, -1, -1);
  const sc = new cv.Scalar(0, 255, 0, 0);
  /*
  const maskingCharVecVec = new cv.CharVectorVector();
  cv.drawMatchesKnn(mat1, kp1, mat2, kp2, good, matchingImage, mc, sc, maskingCharVecVec, 2);
  console.log('onImageMatStero:matchingImage:=<',matchingImage,'>');
  */
}
