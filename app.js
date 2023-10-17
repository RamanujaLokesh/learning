const express = require('express');
const bodyParser = require('body-parser'); 
const morgan = require('morgan'); 
const mongoose = require('mongoose'); 
const Expense = require('./models/expense.js');
//to get the dir name for paths so that we can use relative address

const app = express();
const port = 3000;

const dbURI = 'mongodb+srv://expensestracker:version1@expensestracker.crkyjqi.mongodb.net/expensestracker?retryWrites=true&w=majority'
mongoose.connect(dbURI,{useNewUrlParser:true,useUnifiedTopology:true})
 .then((result)=>{app.listen(port,()=>{console.log(`listening to port  on port no.${port}`)})})
 .catch((err)=>console.log(err));
app.use(express.static("public"))
var just = "";
var total = 0;

app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan("tiny"));





app.get('/add', (req,res)=>{
    const expense = new Expense({
        amount:parseInt(req.body['amount']),
        personCount:parseInt(req.body['personCount']),
        details:req.body['details']
    });
    expense.save()
    .then((result)=>{res.send(result)})
    .catch((err)=>{
        console.log(err);
    });
    
})
// function getdata(){
//     Expense.find()
//     .then(result=>{
//         res
//     })
// }
app.get('/',(req,res)=>{
    // res.render("index.ejs",{spendings:1000});
    Expense.find()
    .then(result=>{
        res.render('index.ejs',{spendings:result})
        console.log(result)
    })
    .catch(err=>{
        console.log('problem in fetching data from db'+err);
    });
});

app.post("/add",(req,res)=>{
console.log(req.body);
const expense = new Expense({
    amount:parseInt(req.body['amount']),
    personCount:parseInt(req.body['personCount']),
    details:req.body['details']
});
expense.save()
.then((result)=>{console.log('saved')})
.catch((err)=>{
    console.log(err);
});
res.redirect('/');
});



