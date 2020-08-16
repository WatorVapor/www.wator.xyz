const uri = 'wss://' + location.hostname + '/api/wss';
class WatorWss {
  constructor() {
    this.socket = new WebSocket(uri);
    const self = this;
    this.socket.addEventListener('open', (evt) => {
      setTimeout(() => {
        self.onOpenWSS(evt);
      },1);
    });
    this.socket.addEventListener('close', (evt) => {
      self.onCloseWSS(evt);
    });
    this.socket.addEventListener('error', (evt) => {
      self.onErrorWSS(evt);
    });
    this.socket.addEventListener('message', (evt) => {
      self.onMessageWSS(evt);
    });    
  }
  onOpenWSS = (evt)=> {
    console.log('onOpenWSS:: evt=<', evt,'>');
  };
  onCloseWSS = (evt)=> {
    console.log('onCloseWSS:: evt=<', evt,'>');
  };
  onErrorWSS = (evt)=> {
    console.log('onErrorWSS:: evt=<', evt,'>');
  };
  sendMsg = (msg) => {
    this.socket.send(JSON.stringify(msg));
  }
}
