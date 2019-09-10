// Starting point of the application
var express = require("express");
var app = express();
var path = require("path");
var port = 8001;
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const fs = require("fs");
var bcrypt =require("bcrypt");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/userprofile");

var nameSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  code: String
});

var userprofile = mongoose.model("User", nameSchema);
// app.use(express.static(__dirname+"public"))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../client/public")));

// app.get("/",(req,res)=>{
//     res.sendFile(path.join(__dirname,"../client/views/register.html"))
// })

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/views/register.html"));
});

app.post("/signup", (req, res) => {
  // console.log(req.body);
  // userprofile.findOne({ email: req.body.email }, function(err, result) {
  //   if (result) {
  //     console.log("mail exists")
  //     userprofile.findOne({username: req.body.username},function(err,result){
  //       console.log(result)
  //       if(result){
  //         console.log("username exists");
  //         res.send({ status: true , type:"emailuser"});
  //       }
  //       else{
  //         res.send({ status:true,type:"email"})
  //       }
  //     })
  //   } else {
  //     userprofile.findOne({username: req.body.username},function(err,result){
  //       console.log(result)
  //       if(result){
  //         console.log("username exists");
  //         res.send({ status: true , type:"user"});
  //       }
  //       else{
          // var hash=bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(8),null);

          // console.log("hash",hash);
          // req.body.password=hash;
          var User = new userprofile(req.body);
          User.password=bcrypt.hashSync(User.password,bcrypt.genSaltSync(8));
          User.save();
          res.send();
        // }
//       })
//     }
// });
});
const html = fs.readFileSync(path.join(__dirname, "../client/views/home.html"));

app.post("/home", (req, res,next) => {
  userprofile.findOne({ username: req.body.username }, function(err, result) {
    console.log("findone", result);
    if (result) {
      console.log("username exist");
      console.log(req.body.password);
      var password = bcrypt.compareSync(req.body.password, result.password)
      if (password) {
        console.log("password exists");
        //res.send({state:false,content:res.sendFile(path.join(__dirname, "../client/views/home.html"))});
        res.json({html:html.toString(),state:false})
        // res.sendFile(path.join(__dirname, "../client/views/home.html"));
      } else {
        res.send({state: true});
        console.log("password not exist");
      }
    } else {
      next({status : 404,message :"user not found"})
      res.send({state: true});
    }
  });
});

app.post("/forgotpassword",(req,res)=>{
  res.sendFile(path.join(__dirname, "../client/views/forgot-password.html"))
})

app.post("/user",(req,res)=>{
  console.log(req.body);
    userprofile.findOne({username: req.body.username},function(err,result){
      console.log(result);
      if(result){
        console.log("exists")
        res.send({status : true})
      }
      else{
        console.log("not exist")
      res.send({status: false})}
    })
})

app.post("/email",(req,res)=>{
  console.log(req.body);
    userprofile.findOne({email: req.body.email},function(err,result){
      console.log(result);
      if(result){
        console.log("exists")
        res.send({status : true})
      }
      else{
        console.log("not exist")
      res.send({status: false})}
    })
})
app.use((error,res,req,next)=>{
  console.log(error);
  res.sendStatus(error.status || 500);
});
app.listen(port, () => {
  console.log("Server listenening to port" + port);
});
