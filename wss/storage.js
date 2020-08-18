const { MongoClient } = require('mongodb');
const username = encodeURIComponent('tYm0IdZ2');
const password = encodeURIComponent('hy8YXhln');
const authMechanism = "DEFAULT";
const dbURL = `mongodb://${username}:${password}@localhost:27017/?Mechanism=${authMechanism}`;
const connectOption = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

module.exports = class MongoStorage {
  constructor() {
    const self = this;
    MongoClient.connect(dbURL,connectOption,(err, client)=>{
      if(!err) {
        self.client_ = client;
        self.onClientCreated_();
      } else {
        console.log('MongoStorage::constructor:err=<', err,'>');
      }
    });
  }
  saveSignup(msg) {
    //console.log('MongoStorage::saveSignup:msg=<', msg,'>');
    msg._at = (new Date()).toISOString();
    this.signup_.insertOne(msg);
  }
  saveSignin(msg) {
    //console.log('MongoStorage::saveSignin:msg=<', msg,'>');
    msg._at = (new Date()).toISOString();
    this.signin_.insertOne(msg);    
  }
  async fetchToken(token,cb) {
    //console.log('MongoStorage::fetchToken:token=<', token,'>');
    const condition = { token: token};
    const options  = {sort:{ _at: -1 }};
    const signup = await this.signup_.findOne(condition,options);
    if(signup) {
      //console.log('MongoStorage::fetchToken:signup=<', signup,'>');
      const profile = await this.profile_.findOne(condition,options);
      //console.log('MongoStorage::fetchToken:profile=<', profile,'>');
      if(profile) {
        signup._profile = profile;
      }
      cb(signup);
    } else {
      cb({});
    }
  }
  
  onClientCreated_() {
    this.edauth_ = this.client_.db('edauth');    
    //console.log('MongoStorage::onClientCreated_:this.edauth_=<', this.edauth_,'>');
    this.signup_ = this.edauth_.collection('signup');
    //console.log('MongoStorage::onClientCreated_:this.signup_=<', this.signup_,'>');
    this.signin_ = this.edauth_.collection('signin');
    //console.log('MongoStorage::onClientCreated_:this.signin_=<', this.signin_,'>');
    this.profile_ = this.edauth_.collection('profile');
    //console.log('MongoStorage::onClientCreated_:this.profile_=<', this.profile_,'>');
  }
}
