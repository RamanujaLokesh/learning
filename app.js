const express = require('express');
const bodyParser = require('body-parser'); 
const morgan = require('morgan'); 
const mongoose = require('mongoose'); 
const Expense = require('./models/expense.js');
const Userdata = require('./models/userdata.js');

const app = express();
const port = 3000;

const dbURI = 'mongodb+srv://expensestracker:version1@expensestracker.crkyjqi.mongodb.net/expensestracker?retryWrites=true&w=majority'
mongoose.connect(dbURI,{useNewUrlParser:true,useUnifiedTopology:true})
 .then((result)=>{app.listen(port,()=>{console.log(`listening to port  on port no.${port}`)})})
 .catch((err)=>console.log(err));
app.use(express.static("public"))


app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan("tiny"));

const username =["ramanuja","likith","rushil"];
const Password = "kolkata";
let i=-1;
let approved = false;
function loginvalidater(urname,passwd){
if(passwd!==Password)
return false;
if (username.includes(urname)) {
    let j=0
    while (j < username.length) {
        if (urname===username[j]) {
            i=j;
        }
        j++;
    }
    approved = true;
    return true;
}
}
app.get('/' ,(req,res)=>{
res.render('login.ejs');
});
app.post('/loginuser',(req,res)=>{
    i=-1;
    
if (loginvalidater(req.body['username'],req.body['password'])) {
    console.log('approved from loginvalidator');
    res.redirect('/home')
} else {
    console.log('not approved by loginvalidator')
    res.redirect('/')
}
})


app.get('/home',(req,res)=>{
if (approved) {
    Expense.find({person:username[i]})
    .then(result=>{
        res.render('index.ejs',{spendings:result});
    })
    .catch(err=>console.log(err));
} else {
    res.render('login.ejs');
}
});


app.post("/add",(req,res)=>{
console.log(req.body);
const expense = new Expense({
    person:username[i],
    amount:parseInt(req.body['amount']),
    personCount:parseInt(req.body['personCount']),
    details:req.body['details']
});
expense.save()
.then((result)=>{console.log('saved')})
.catch((err)=>{
    console.log(err);
});
res.redirect('/home');
});


app.get('/delete/:id',async (req,res)=>{
    const id = req.params.id;
    console.log( 'the id is::'+id);
    const expensed =await Expense.findById(id);
    console.log(expensed);
    Expense.deleteOne({_id:id})
    .then(function(){
        console.log("Data deleted"); // Success
    }).catch(function(error){
        console.log(error); });
    res.redirect('/home');
});


