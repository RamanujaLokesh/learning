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
let approved=false;



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

let presentUser;
let pinfrmdb;
let pinfrminput;

app.post('/loginuser',  (req, res) => {
    Userdata.findOne({ username: req.body['username'] })
      .then((result) => {
        presentUser = result;
        pinfrmdb = parseInt(presentUser.pin);
  pinfrminput=parseInt(req.body['pin']);
        // Define a callback function to update approved and redirect
        const loginCallback = () => {
          approved = true;
        };
        
        // if (pinfrmdb === parseInt(req.body['pin'])) {
            //   console.log('approved from loginvalidator');
            //   // Call the callback function if password is correct
            //   loginCallback();
            // } else {
                //   console.log('not approved by loginvalidator');
                //   res.redirect('/');
                // }
            })
            .catch((err) => {
                console.log('error in getting username and password is::' + err);
            });
            res.redirect('/home');
  });
  


app.get('/signuppg',(req,res)=>{
res.render('signup.ejs');
});


app.get('/loginuser',(req,res)=>{
res.redirect('/');
});



app.post("/register-user",(req,res)=>{
    console.log(req.body);
    const userdata = new Userdata({
        username:req.body['username'],
        pin:parseInt(req.body['pin'])
    });
    userdata.save()
    .then((result)=>{console.log('saved')})
    .catch((err)=>{
        console.log(err);
    });
    res.redirect('/');
    });


    app.get('/home', (req, res) => {
        console.log(pinfrmdb,pinfrminput)
        // Check login status before proceeding
        if (pinfrmdb!==pinfrminput) {
          res.redirect('/');
          return;
        }
      
        Expense.find({ person: presentUser.username })
          .then(result => {
            res.render('index.ejs', { spendings: result });
          })
          .catch(err => console.log(err));
      });
      


app.post("/add",(req,res)=>{
console.log(req.body);
console.log(presentUser);
const expense = new Expense({
    person:presentUser.username,
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


