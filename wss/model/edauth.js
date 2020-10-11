const mongoose = require('mongoose');
const Model = require('../model.js');
const EdAuthSchema = new mongoose.Schema({
  t:String,
  s:Date,
  o:String
});
const mode = new Model();
const EdAuth = mongoose.model('edauth',EdAuthSchema);
EdAuth.create();
module.exports = EdAuth;

