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


app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan("tiny"));


let approved=false;
let presentUser;
// let pinfrmdb;
// let pinfrminput;




app.get('/' ,(req,res)=>{
res.render('login.ejs');
});



app.post('/loginuser', async (req, res) => {
  try{
     presentUser = await Userdata.findOne({ username: req.body['username'] })
    
    console.log(req.body['password'])
    if (presentUser.pin === parseInt(req.body['password'])) {
      approved=true;
      res.redirect("/home");
      // res.render("index.ejs");
    } else {
      res.redirect("/");
      // res.send("wrong password");
    }
  } catch {
    res.redirect("/");
    // res.send("wrong details");
  }
});



app.get('/signuppg',(req,res)=>{
res.render('signup.ejs');
});


app.get('/loginuser',(req,res)=>{
res.redirect('/');
});



app.post("/register-user", async(req,res)=>{
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


    app.get('/home', async(req, res) => {
        // console.log(pinfrmdb,pinfrminput)
        // Check login status before proceeding
        if (!approved) {
          res.redirect('/');
          return;
        }
      
      await  Expense.find({ person: presentUser.username })
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


app.get('/logout',(req,res)=>{
res.redirect('/');
});


