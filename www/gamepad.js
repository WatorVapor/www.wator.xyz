window.addEventListener('gamepadconnected', (evt) =>{
  console.log('gamepadconnected::evt=<',evt,'>');
  onGamePadConnected(evt.gamepad);
});

window.addEventListener('ongamepaddisconnected', (evt) =>{
  console.log('ongamepaddisconnected::evt=<',evt,'>');
});

window.addEventListener('DOMContentLoaded', async (evt) =>{
  console.log('DOMContentLoaded::evt=<',evt,'>');
  const devices = await navigator.hid.getDevices();
  console.log('DOMContentLoaded::devices=<',devices,'>');
  devices.forEach(device => {
    console.log('HID: ${device.productName}');
    console.log('DOMContentLoaded::device=<',device,'>');
  });
  getGamepadInfo();
});

navigator.hid.addEventListener('connect', async (device) => {
  console.log('HID connected: ${device.productName}');
});

navigator.hid.addEventListener('disconnect', async (device) => {
  console.log('HID disconnected: ${device.productName}');
});



const onGamePadConnected = (gamepad)=> {
  console.log('onGamePadConnected::gamepad=<',gamepad,'>');
  setInterval(()=>{
    readGamePad(gamepad.index);
  },20);
}

const gConnectedGamePad = {};
let isSendingGamepade = false;
const getGamepadInfo = async ()=> {
  const gamepads = navigator.getGamepads();
  console.log('getGamepadInfo::gamepads=<',gamepads,'>');
  for(let index = 0;index < gamepads.length;index++) {
    const gamepad = gamepads[index];
    console.log('getGamepadInfo::gamepad=<',gamepad,'>');
    if(gamepad) {
      console.log('getGamepadInfo::gamepad=<',gamepad,'>');
      const encoder = new TextEncoder();
      const data = encoder.encode(gamepad.id);
      const hash = await crypto.subtle.digest('SHA-1',data);
      const hashArray = Array.from(new Uint8Array(hash));
      const hashHex = 'id_'  + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      //console.log('getGamepadInfo::hashHex=<',hashHex,'>');
      gConnectedGamePad[hashHex] = gamepad;
    }
  }
  //console.log('getGamepadInfo::gConnectedGamePad=<',gConnectedGamePad,'>');
  const idIndex = Object.keys(gConnectedGamePad);
  //console.log('getGamepadInfo::idIndex=<',idIndex,'>');
  if(idIndex.length > 0) {
    const mainPad = document.getElementById('gamepad-main');
    mainPad.textContent = gConnectedGamePad[idIndex[0]].id;
    if(isSendingGamepade) {
      mainPad.setAttribute('class','badge badge-success');
    } else {
      mainPad.setAttribute('class','badge badge-secondary');
    }
  }
  if(idIndex.length > 1) {
    const subPad = document.getElementById('gamepad-sub');
    subPad.textContent = gConnectedGamePad[idIndex[1]].id;
    if(isSendingGamepade) {
      subPad.setAttribute('class','badge badge-success');
    } else {
      subPad.setAttribute('class','badge badge-secondary');
    }
  }
}

const buf2hex = (buffer) => { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

const uiOnClickGamepadBtn = async (elem) => {
  console.log('uiOnClickGamepadBtn::elem=<',elem,'>');

  try {
    const deviceFilters = [
    /* 
      all device.
    */
    ]; 
    const devices = await navigator.hid.requestDevice({filters: deviceFilters });
    //const devices = await navigator.hid.requestDevice({acceptAllDevices:true});
    //device = devices[0];
    console.log('uiOnClickGamepadBtn::uiOnClickGamepadBtn::devices=<',devices,'>');
    devices.forEach( async (device)=>{
      console.log('uiOnClickGamepadBtn::uiOnClickGamepadBtn::device=<',device,'>');
      device.oninputreport = (evt) => {
        //console.log('uiOnClickGamepadBtn::uiOnClickGamepadBtn::evt=<',evt,'>');
        //console.log('uiOnClickGamepadBtn::uiOnClickGamepadBtn::evt.data.buffer=<',evt.data.buffer,'>');
        const hexGamepadInput = buf2hex(evt.data.buffer);
        //console.log('uiOnClickGamepadBtn::uiOnClickGamepadBtn::hexGamepadInput=<',hexGamepadInput,'>');
      }
      await device.open();
    });
  } catch (error) {
    console.warn('No device access granted', error);
  }
  
  if(isSendingGamepade === false) {
    elem.textContent = 'ゲームパッド送信停止';
    elem.setAttribute('class','btn btn-danger');
  } else {
    elem.textContent = 'ゲームパッド送信開始';
    elem.setAttribute('class','btn btn-success');    
  }
  isSendingGamepade = ! isSendingGamepade;
  getGamepadInfo();
}



const readGamePad = (gamepadIndex)=> {
  const gamepad = navigator.getGamepads()[gamepadIndex];
  //console.log('readGamePad::gamepad=<',gamepad,'>');
  //console.log('readGamePad::gamepad.axes=<',gamepad.axes,'>');
  //console.log('readGamePad::gamepad.buttons=<',gamepad.buttons,'>');
  const gamepadEvt = {
    gamepad:{
      id:gamepad.id,
      axes:gamepad.axes,
      buttons:[]
    }
  };
  for(const btn of gamepad.buttons) {
    //console.log('readGamePad::btn=<',btn,'>');
    const btnObj = {
      pressed:btn.pressed,
      touched:btn.touched,
      value:btn.value
    };
    gamepadEvt.gamepad.buttons.push(btnObj);
  }
  //console.log('readGamePad::gamepadEvt=<',JSON.stringify(gamepadEvt),'>');
  //console.log('readGamePad::isSendingGamepade=<',isSendingGamepade,'>');
  if(isSendingGamepade === true) {
    sendInput(gamepadEvt);
  }
}