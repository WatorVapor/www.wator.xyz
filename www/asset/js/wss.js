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
  sendMsg (msg){
    this.socket.send(JSON.stringify(msg));
  }
  onOpenWSS(evt) {
    console.log('WatorWss::onOpenWSS: evt=<', evt,'>');
  };
  onCloseWSS (evt) {
    console.log('WatorWss::onCloseWSS: evt=<', evt,'>');
  };
  onErrorWSS (evt) {
    console.log('WatorWss::onErrorWSS: evt=<', evt,'>');
  };
  onMessageWSS(evt) {
    //console.log('WatorWss::onMessageWSS: evt.data=<', evt.data,'>');
    try {
      const jData = JSON.parse(evt.data);
      //console.log('WatorWss::onMessageWSS: jData=<', jData,'>');
      if(typeof this.onMsg === 'function') {
        this.onMsg(jData);
      }
    } catch(err) {
      console.error('WatorWss::onMessageWSS: err=<', err,'>');
    }
  }
}