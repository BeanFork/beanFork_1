// Starting point of the application
var express = require("express");
var app = express();
var path =require("path");
var port = 8000;
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/userprofile");

var nameSchema = new mongoose.Schema({
  username: String,
  emailid: String,
  password: String,
  code: String
});

var userprofile = mongoose.model("User", nameSchema);
// app.use(express.static(__dirname+"public"))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"../client/public")));


// app.get("/",(req,res)=>{
//     res.sendFile(path.join(__dirname,"../client/views/register.html"))
// })

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"../client/views/forgot-password.html"))
})
app.post("/submit",(req,res)=>{
    res.sendFile(path.join(__dirname,"../client/views/change-password.html"))
})
app.listen(port, () => {
    console.log("Server listenening to port" + port);

  });