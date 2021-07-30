const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const username = encodeURIComponent('tYm0IdZ2');
const password = encodeURIComponent('hy8YXhln');
const dbURL = `mongodb://${username}:${password}@%2Fdev%2Fshm%2Fmongodb-27017.sock`;
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
