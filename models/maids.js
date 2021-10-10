const mongoose = require("mongoose");

const MaidSchema = mongoose.Schema({
  fname : String,
  lname : String,
  dob : Date,
  mobile : String,
  address : String,
  city : String,
  state : String,
  work : String,
  working : Boolean,
});

//collection
module.exports.maid = mongoose.model("Maid", MaidSchema);