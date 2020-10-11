const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const username = encodeURIComponent('tYm0IdZ2');
const password = encodeURIComponent('hy8YXhln');
const authMechanism = "DEFAULT";
const dbURL = `mongodb://${username}:${password}@localhost:27017/?Mechanism=${authMechanism}`;
const connectOption = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

module.exports = class Model {
  constructor() {
    mongoose.connect(dbURL,connectOption);
  }
  model(name,schema) {
    mongoose.model(name,schema); 
  }
}
