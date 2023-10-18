const mongoose = require('mongoose');
const Schema = mongoose.Schema;



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


const Userdata = mongoose.model('Userdata',expenseSchema);

module.exports = Userdata;
