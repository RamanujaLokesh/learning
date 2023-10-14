import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
//to get the dir name for paths so that we can use relative address

const app = express();
const port = 3000;
app.use(express.static("public"))
var just = "";
var total = 0;

app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan("tiny"));

app.get('/',(req,res)=>{
    res.render("index.ejs");
})

app.post("/add",(req,res)=>{
console.log(req.body);
total = total+parseInt(req.body['amount']);//output of req.body is string so modify it
res.render("index.ejs",{total:total});
});
app.listen(port,()=>{console.log(`listening to port  on port no.${port}`)});