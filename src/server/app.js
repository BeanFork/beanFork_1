// Starting point of the application
var util = require("./util")
var express = require("express");
var app = express();
var path = require("path");
var port = 5001;
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const fs = require("fs");
var bcrypt = require("bcrypt");


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
      postTime: Number,
      comments: [
        {
          userId: String,
          comment: String
        }
      ]
    }
  ],

});

var postSchema = new mongoose.Schema({
  username: String,
  topic: String,
  description: String,
  postTime: Number,
  userid: String,
  comments: [
    {
      userId: String,
      comment: String
    }
  ],
});


var postProfile = mongoose.model("Post", postSchema);
var userProfile = mongoose.model("User", nameSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../client/public")));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/public/views/register.html"));
});

//signup and sending verification code

app.post("/signup", (req, res) => {
  //  function verificationCode(){
  //     return Verificationcode = Math.random()
  //     .toString(36)
  //     .slice(-8);
  // }
  var verificationCode = util.sendMail(req.body.email);

  console.log(verificationCode);


  var user = new userProfile(req.body);
  user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8));
  user.code = verificationCode;
  user.save();
  console.log("email", req.body.email);
  res.send({ status: true, email: req.body.email });
});

//Fetching the id to the local host

app.post("/signupverification", (req, res) => {
  userProfile.findOne({ email: req.body.email }, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.send({ id: result._id });
    }
  });
});

//verification of code for signup

app.post("/code", (req, res, next) => {
  userProfile.findOne({ _id: req.body.id }, function (err, result) {
    console.log("this is code result", result);
    console.log(req.body.code);
    if (result) {
      if (result.code === req.body.code) {
        //res.sendFile(path.join(__dirname, "../client/public/views/home.html"));
        res.send({ status: true, username: result.username })
      } else {
        next({ status: 401, message: "Verification code is incorrect" });
      }
    } else {
      next({ status: 401, message: "Verification code is incorrect" });
    }
  });
});


/*login
*/


//const html = fs.readFileSync(path.join(__dirname, "../client/public/views/home.html"));

app.post("/home", (req, res, next) => {
  userProfile.findOne({ username: req.body.username }, function (err, result) {

    if (result) {
      console.log("username exists");
      console.log(req.body.password);

      if (bcrypt.compareSync(req.body.password, result.password)) {
        console.log("password exists");

        res.send({ status: true, userData: result })

      } else {
        next({ status: 401, message: "Incorrect Password" });
      }
    } else {
      next({ status: 401, message: "Incorrect Password" });
    }
  });
});

//User Existence

app.post("/user", (req, res) => {
  userProfile.findOne({ username: req.body.username }, function (err, result) {
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
  userProfile.findOne({ email: req.body.email }, function (err, result) {
    if (result) {
      res.send({ status: true });
    } else {
      res.send({ status: false });
    }
  });
});


//Rendering Forgot password

app.post("/forgotpassword", (req, res) => {

  res.send({ status: true })

});

/**HOME.HTML */


//Rendering new discussion.html

app.post("/newdiscussion", (req, res, next) => {


  res.send({ status: true })

});




//Creating the new discussion 


app.post("/creatediscussion", (req, res, next) => {
  userProfile.findOne({ _id: req.body.id }, function (err, result) {
    if (err) {
      console.log(err);
    }
    var postObject = {
      topic: req.body.topic,
      description: req.body.description,
      postTime: req.body.postTime
    };
    result.post.unshift(postObject);
    // console.log("final result", result);
    result.save();
    //res.send({status: true , postdata:result})
    // res.json({ status:true,html: html.toString(), postdata: result }); 
    var post = new postProfile(req.body);
    post.save();

    postProfile.findOne({ postid: req.body.postid }, function (err, result1) {
      if (err) {
        console.log(err);
      }

      result1.topic = req.body.topic,
        result1.description = req.body.description,
        result1.postTime = req.body.postTime,
        result1.username = req.body.username

      result1.save();
      


      postProfile.find({},function(err,result2){
         if(err){
           console.log(err);
         }
         console.log("res2",result2)

         res.json({ status: true, postData: result, trendData: result2 });
      }).sort({postTime:-1}).limit(5)
    });
  });
  //res.send(result);

})



///////////////////////////////////////////////////////////////////

app.post("/sendcode", (req, res) => {


  userProfile.findOne({ email: req.body.email }, function (err, user) {

    if (user) {
      var verificationCode = Math.random()
        .toString(36)
        .slice(-8);
      console.log(verificationCode)

      user.code = verificationCode;
      console.log("Hiiiii");
      user.save();

      res.send({ status: true })
    }
    else {
      console.log("email doesn't exist in ")
      res.send({ status: false })

    }
  })
  // var transporter = nodemailer.createTransport({
  //   service: 'Gmail',
  //   auth: {
  //     user: 'beanforkaccess@gmail.com',
  //     pass: 'Admin@123'
  //   }
  // });



  // res.sendFile(path.join(__dirname, "/view/home.html"));
  // transporter.sendMail({
  //   from: 'beanforkaccess@gmail.com',
  //   to: req.body.email,
  //   subject: 'Forgot Password',
  //   text: 'Verification code is ' + req.body.code

  // }, function (err) {
  //   if (err)
  //     console.log(err);
  // });
})


app.post("/submitcode", (req, res) => {

  //res.sendFile(__dirname + "/view/changePassword.html")
  userProfile.findOne({ email: req.body.email }, function (err, result) {

    if (result) {
      if (result.code === req.body.code) {
        console.log("code is true");
        res.send({ status: true, userdata: result });
      } else {
        res.send({ status: false });
        console.log("code is false");
      }
    }
    else {
      console.log("email doesn't exist in database")
    }
  })

})



app.post("/changepassword", (req, res) => {

  userProfile.findOne({ email: req.body.email }, function (err, user) {
    if (user) {


      user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8));

      user.save();
      res.send({ status: true })

    }
    else
      res.send({ status: false })
  })
})



app.use((error, req, res, next) => {
  console.log(error);
  res.sendStatus(error.status || 500);
});
app.listen(port, () => {
  console.log("Server listenening to port " + port);
});