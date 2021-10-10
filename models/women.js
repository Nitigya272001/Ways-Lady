const mongoose = require("mongoose");

const WomenSchema = mongoose.Schema({
  name: String,
  mobile: String,
  medicalReport : Object
});

//collection
module.exports.women = mongoose.model("Women", WomenSchema);