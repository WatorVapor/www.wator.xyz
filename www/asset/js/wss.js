const uri = 'wss://' + location.hostname + '/api/wss';
const socket = new WebSocket(uri);
socket.addEventListener('open', (event) => {
  setTimeout(() => {
    onOpenWSS(event);
  },1);
});
socket.addEventListener('close', (event) => {
  onCloseWSS(event);
});
socket.addEventListener('error', (event) => {
  onErrorWSS(event);
});
socket.addEventListener('message', (event) => {
  onMessageWSS(event);
});


const onOpenWSS = (event)=> {
  console.log('onOpenWSS:: event=<', event,'>');
};
const onCloseWSS = (event)=> {
  console.log('onCloseWSS:: event=<', event,'>');
};
const onErrorWSS = (event)=> {
  console.log('onErrorWSS:: event=<', event,'>');
};

const sendMsg = (msg) => {
  socket.send(JSON.stringify(msg));
}