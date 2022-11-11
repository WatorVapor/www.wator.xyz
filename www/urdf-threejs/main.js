import * as THREE from 'three';
import * as DAE from 'ColladaLoader';
import * as Control from 'OrbitControls';
console.log('THREE:=<',THREE,'>');
console.log('DAE:=<',DAE,'>');
console.log('Control:=<',Control,'>');
const loader = new DAE.ColladaLoader();
window.addEventListener('DOMContentLoaded', ()=>{
  createRobot3DModel();
});



const createRobot3DModel = () => {
  
  const container = document.getElementById("canvas");
  console.log('createRobot3DModel::container:=<',container,'>');

  const width = container.clientWidth;
  const height = container.clientHeight;

  // scene
  const scene = new THREE.Scene();

  // grid
  scene.add(new THREE.GridHelper(1, 10));

  // hemisphere light
  scene.add(new THREE.HemisphereLight());

  // directional light (blue from above)
  scene.add(new THREE.DirectionalLight(0x56a0d3, 0.5));

  // point light (red from the front)
  const pointLight = new THREE.PointLight(0x330000);
  pointLight.position.set(0, 0.4, 3);
  scene.add(pointLight);

  load3DModel(scene);

  // camera
  const camera = new THREE.PerspectiveCamera(30, width / height, 0.01, 100);
  camera.position.set(0, 1, 2);

  // renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // control
  const controls = new Control.OrbitControls(camera, renderer.domElement);
  controls.target = new THREE.Vector3(0, 0.3, 0);
  controls.maxPolarAngle = Math.PI / 2;
  

 
  const tick = () =>{
    //console.log('tick::scene:=<',scene,'>');
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }      
  tick();
}

const load3DModel = (scene) => {
  loader.load('./assets/ur5.dae', (robot) => {
    console.log('load3DModel::robot:=<',robot,'>');
    const kinematics = robot.kinematics;
    console.log('load3DModel::kinematics:=<',kinematics,'>');
    const daeScene = robot.scene;
    console.log('load3DModel::daeScene:=<',daeScene,'>');
    daeScene.traverse( (child) =>{
      if (child.isMesh) {
        console.log('load3DModel::child.isMesh:=<',child.isMesh,'>');
        console.log('load3DModel::child:=<',child,'>');
        if (Array.isArray(child.material)) {
          for (let m of child.material) {
            console.log('load3DModel::m.flatShading:=<',m.flatShading,'>');
            m.flatShading = true;
          }
        } else {
          console.log('load3DModel::child.material.flatShading:=<',child.material.flatShading,'>');
          child.material.flatShading = true;
        }
      }
    });
    scene.add(daeScene);
    setInterval(()=>{
      animateKinematics(kinematics);
    },100);
  })
}


const arrConstJointsValue = {
  //'base_link-base_fixed_joint':180,
  //world_joint:0,
  shoulder_pan_joint:0,
  shoulder_lift_joint:-45,
  elbow_joint:45,
  wrist_1_joint:0,
  wrist_2_joint:0,
  wrist_3_joint:0,
  //'wrist_3_link-tool0_fixed_joint':0,
};

const animateKinematics = (kinematics)=> {
  //console.log('animateKinematics::kinematics:=<',kinematics,'>');
  for(const joint in arrConstJointsValue) {
    //console.log('animateKinematics::joint:=<',joint,'>');
    const value = kinematics.getJointValue(joint);
    //console.log('animateKinematics::value:=<',value,'>');
    const randomValue = arrConstJointsValue[joint] + 15 * Math.random();
    kinematics.setJointValue(joint,randomValue);
  }
}

