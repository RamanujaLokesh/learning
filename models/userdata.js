const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// var passportLocalMongoose = require("passport-local-mongoose");


const userdataSchema = new Schema({
   username:{
type:String,
required:true
   },
   pin:{
    type:Number,
    required: true
   }
},{ timestamps:true});

// userdataSchema.plugin(passportLocalMongoose);
const Userdata = mongoose.model('Userdata',userdataSchema);

module.exports = Userdata;
