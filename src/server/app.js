// Starting point of the application
var express = require("express");
var app = express();
var path = require("path");
var port = 5000;
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const fs = require("fs");
var bcrypt = require("bcrypt");
var nodemailer = require("nodemailer");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/userprofile");
/*mongoose.connect("mongodb+srv://beanforkaccess:Admin@123@beanfork-ddksd.mongodb.net/test?retryWrites=true&w=majority",{
  useNewUrlParser:true
})*/

var nameSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  code: String,
  post: [
    {
      topic: String,
      description: String,
      posttime: Number,
      comments: [
        {
          userid: String,
          comment: String
        }
      ]
    }
  ]
});
var userprofile = mongoose.model("User", nameSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../client/public")));
// app.use('/',require('./routes/api/user/main'));
// app.use("/home",require('./routes/api/user/home'));
// app.use('/forgotpassword',require('./routes/api/user/forgotpassword'))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/public/views/register.html"));
});

//signup and sending verification code

app.post("/signup", (req, res) => {
  var Verificationcode = Math.random()
    .toString(36)
    .slice(-8);

  console.log(Verificationcode);
  var transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "beanforkaccess@gmail.com",
      pass: "Admin@123"
    }
  });

  transporter.sendMail(
    {
      from: "beanforkaccess@gmail.com",
      to: req.body.email,
      subject: "Forgot Password",
      text: "Verification code is " + Verificationcode
    },
    function(err) {
      if (err) console.log(err);
    }
  );
  var User = new userprofile(req.body);
  User.password = bcrypt.hashSync(User.password, bcrypt.genSaltSync(8));
  User.code = Verificationcode;
  User.save();
  console.log("email", req.body.email);
  res.send({ status: true, email: req.body.email });
});

//Fetching the id to the local host

app.post("/signupverification", (req, res) => {
  userprofile.findOne({ email: req.body.email }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      res.send({ id: result._id });
    }
  });
});

//verification of code for signup

app.post("/code", (req, res, next) => {
  userprofile.findOne({ _id: req.body.id }, function(err, result) {
    console.log("this is code result", result);
    console.log(req.body.code);
    if (result) {
      if (result.code === req.body.code) {
        //res.sendFile(path.join(__dirname, "../client/public/views/home.html"));
        res.send({status:true})
      } else {
        next({ status: 404, message: "Verification code is incorrect" });
      }
    } else {
      next({ status: 404, message: "Verification code is incorrect" });
    }
  });
});


//login

const html = fs.readFileSync(path.join(__dirname, "../client/public/views/home.html"));

app.post("/home", (req, res, next) => {
  userprofile.findOne({ username: req.body.username }, function(err, result) {
    console.log("findone", result);
    if (result) {
      console.log("username exist");
      console.log(req.body.password);
      var password = bcrypt.compareSync(req.body.password, result.password);
      if (password) {
        console.log("password exists");
        //res.json({ html: html.toString(), state: false, id: result._id });
        res.send({status:true})
        //res.sendFile(path.join(__dirname, "../client/views/home.html"));
      } else {
        next({ status: 404, message: "username or password not found" });
      }
    } else {
      next({ status: 404, message: "username or password not found" });
    }
  });
});

//User Existence

app.post("/user", (req, res) => {
  userprofile.findOne({ username: req.body.username }, function(err, result) {
    if (result) {
      res.send({ status: true });
    } else {
      res.send({ status: false });
    }
  });
});

//Email Existence

app.post("/email", (req, res) => {
  console.log(req.body);
  userprofile.findOne({ email: req.body.email }, function(err, result) {
    if (result) {
      res.send({ status: true });
    } else {
      res.send({ status: false });
    }
  });
});


//Rendering Forgot password

app.post("/forgotpassword", (req, res) => {
  //res.sendFile(path.join(__dirname, "../client/public/views/forgot-password.html"));
  res.send({status:true})
});

/**HOME.HTML */


//Rendering new discussion.html

app.post("/newdiscussion", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../client/public/views/new-discussion.html"));
});


//Creting the new discussion 


app.post("/creatediscussion", (req, res, next) => {
  userprofile.findOne({ _id: req.body.id }, function(err, result) {
    var postobject = {
      topic: req.body.topic,
      description: req.body.description,
      posttime: req.body.posttime
    };
    result.post.unshift(postobject);
    console.log("final result", result);
    result.save();
    res.json({ html: html.toString(), postdata: result});
   //res.send(result);
  });
});

app.use((error, req, res, next) => {
  console.log(error);
  res.sendStatus(error.status || 500);
});
app.listen(port, () => {
  console.log("Server listenening to port" + port);
});
