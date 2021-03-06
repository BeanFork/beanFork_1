// Starting point of the application
var util = require("./util");
var postProfile = require("./models/post")
var userProfile = require("./models/user")
var express = require("express");
var app = express();
var path = require("path");
var port = 5005;
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.Promise = global.Promise;
//mongoose.connect("mongodb://localhost:27017/userprofile");

var bcrypt = require("bcrypt");
require('dotenv').config();
// run "export node_env=dev"

var checkAuth = require("./routes/api/user/authenticate-token");
var tokenGen = require("./routes/api/user/generate-token");



mongoose.connect("mongodb+srv://beanforkaccess:Admin@123@beanfork-ddksd.mongodb.net/test?retryWrites=true&w=majority",{
  useNewUrlParser:true
})



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../client/public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/public/views/register.html"));
});

//signup and sending verification code

app.post("/signup", (req, res) => {
  var verificationCode = util.sendMail(req.body.email);

  console.log(verificationCode);

  var user = new userProfile(req.body);

  user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8));
  user.code = verificationCode;
  user.save();

  res.send({ status: true, email: req.body.email, userData: user });
});

//Fetching the id to the local host

app.post("/signupverification", tokenGen, (req, res) => {

  userProfile.findOne({ _id: req.body.email }, function (err, result) {
    if (err) {
      console.log(err);
    } else {

      res.send({ id: result._id, token: res.locals.token });
    }
  });
});

//verification of code for signup

app.post("/code", (req, res, next) => {
  userProfile.findOne({ _id: req.body.id }, function (err, result) {
    if (result) {
      if (result.code === req.body.code) {
        postProfile
          .find({}, function (err, posts) {
            if (err) {
              console.log(err);
            }

            res.json({ status: true, userData: result, trendData: posts });
          })
          .sort({ postTime: -1 });
      } else {
        res.json({ status: false, message: "Verification code izz incorrect" });
      }
    }
  });
});

/*login
 */

app.post("/home", tokenGen, (req, res, next) => {
  userProfile.findOne({ username: req.body.username }, function (err, result) {
    if (result) {

      if (bcrypt.compareSync(req.body.password, result.password)) {
        postProfile
          .find({}, function (err, posts) {
            if (err) {
              console.log(err);
            }

            console.log("tokens gen", res.locals.token);

            res.send({ status: true, userData: result, trendData: posts, token: res.locals.token });
          })
          .sort({ postTime: -1 });
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

  res.send({ status: true });
});

/**HOME.HTML */

//Rendering new discussion.html

app.post("/newdiscussion", checkAuth, (req, res, next) => {

  res.send({ status: true });
});

//Creating the new discussion

app.post("/creatediscussion", checkAuth, (req, res, next) => {
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

    result.save();

    req.body.postid = result.post[0]._id;

    var post = new postProfile(req.body);
    post.save();

    res.json({ status: true, postData: result });
  });
});

app.post("/newcreate", checkAuth, (req, res) => {
  postProfile
    .find({}, function (err, posts) {
      if (err) {
        console.log(err);
      }

      res.json({ trendData: posts });
    })
    .sort({ postTime: -1 });
});

app.post("/cancelDiscussion", checkAuth, (req, res) => {
  userProfile.findOne({ username: req.body.username }, function (err, result) {
    if (result) {
      postProfile
        .find({}, function (err, posts) {
          if (err) {
            console.log(err);
          }

          res.json({ status: true, userData: result, trendData: posts });
        })
        .sort({ postTime: -1 });
    }
  });
});

///////////////////////////////////////////////////////////////////

app.post("/sendcode", (req, res) => {
  userProfile.findOne({ email: req.body.email }, function (err, user) {
    if (user) {
      var verificationCode = Math.random()
        .toString(36)
        .slice(-8);
      console.log(verificationCode);

      user.code = verificationCode;
      user.save();

      res.send({ status: true });
    } else {
      console.log("email doesn't exist in ");
      res.send({ status: false });
    }
  });
});

app.post("/submitcode", (req, res) => {
  userProfile.findOne({ email: req.body.email }, function (err, result) {
    if (result) {
      if (result.code === req.body.code) {
        res.send({ status: true, userData: result, username: result.username });
      } else {
        res.send({ status: false });
      }
    } else {
      console.log("email doesn't exist in database");
    }
  });
});

app.post("/changepassword", tokenGen, (req, res) => {
  userProfile.findOne({ email: req.body.email }, function (err, user) {
    if (user) {
      user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8));

      user.save();

      postProfile
        .find({}, function (err, posts) {
          if (err) {
            console.log(err);
          }

          res.json({ status: true, userData: user, trendData: posts, token: res.locals.token });
        })
        .sort({ postTime: -1 });
    }
  });
});

app.post("/editpage", checkAuth, (req, res, next) => {


  postProfile.findOne({ postid: req.body.postId }, function (err, result) {
    if (result) {

      res.json({
        status: true,
        topic: result.topic,
        description: result.description,

      });
    }

  });
});

app.post("/editdiscussion", checkAuth, (req, res) => {
  postProfile.findOne({ postid: req.body.postId }, function (err, post1) {
    if (post1) {
      post1.topic = req.body.topic;
      post1.description = req.body.description;
      post1.postTime = req.body.postTime;
      post1.save();

      userProfile
        .findOne({ _id: req.body.userId }, function (err, user) {
          if (user) {
            for (var i = 0; i < user.post.length; i++) {
              if (req.body.postId == user.post[i]._id) {
                user.post[i].postTime = req.body.postTime;
                user.post[i].topic = req.body.topic;
                user.post[i].description = req.body.description;
                user.save();
              }
            }
            postProfile
              .find({}, function (err, result) {
                res.json({ status: true, userData: user, trendData: result });
              })
              .sort({ postTime: -1 });
          } else console.log("no user");
        })
        .sort({ postTime: -1 });
    }
  });
});

app.post("/delete", checkAuth, (req, res) => {
  postProfile.findOne({ postid: req.body.postId }, function (err, post1) {
    if (post1) {

      post1.remove();

      userProfile.findOne({ _id: req.body.userId }, function (err, user) {
        if (user) {
          for (var i = 0; i < user.post.length; i++) {
            if (req.body.postId == user.post[i]._id) {

              user.post[i].remove();
              user.save();
            }
          }
          postProfile.find({}, function (err, result) {
            res.json({ status: true, userData: user, trendData: result });
          });
        } else console.log("no user");
      });
    }
  });
});

app.post("/comment", checkAuth, (req, res) => {
  postProfile.findOne({ postid: req.body.postId }, function (err, user) {

    userProfile.findOne({ username: user.username }, function (err, result) {
      var commentObject = {
        comment: req.body.comment,
        username: req.body.username
      };
      if (result) {
        for (var i = 0; i < result.post.length; i++) {
          if (
            JSON.stringify(result.post[i]._id) ===
            JSON.stringify(req.body.postId)
          ) {
            result.post[i].comments.unshift(commentObject);
            result.save();

            res.send({ username: user.username, postData: result.post[i] });
            break;
          }
        }
      } else {
        console.log("error");
      }
    });
  });
});

app.post("/middleRender", checkAuth, (req, res) => {
  userProfile.findOne({ _id: req.body.userId }, function (err, user) {
    if (user) {
      for (var i = 0; i < user.post.length; i++) {
        if (
          JSON.stringify(user.post[i]._id) === JSON.stringify(req.body.postId)
        ) {
          res.send({ userData: user.post[i], username: user.username });
          break;
        }
      }
    }
  });
});

app.post("/middleRender1", checkAuth, (req, res) => {
  postProfile.findOne({ _id: req.body.id }, function (err, user) {
    if (user) {
      userProfile.findOne({ username: user.username }, function (err, result) {
        res.send({ trendData: user, userData: result });
      });
    }
  });
});

app.post("/search", checkAuth, (req, res) => {
  var s = req.body.search;

  postProfile
    .find({ topic: { $regex: ".*" + s + ".*", $options: "i" } }, function (
      err,
      search
    ) {
      if (err) {
        console.log("err in search");
      }

      if (search.length > 0) {
        res.send({ status: true, postData: search });
      } else res.send({ status: false });
    })
    .sort({ postTime: -1 });
});

app.post("/settings", checkAuth, (req, res) => {
  res.send({ status: true });

});

///////////////Logout

app.post("/logout", (req, res) => {
  res.send({ status: true });

  console.log("---logged-out successfully---");
});

//////////move to home

app.get("/restore", (req, res) => {
  res.send({ status: true });
});

// Go to Main Page

app.post("/homePage", checkAuth, (req, res) => {

  userProfile.findOne({ _id: req.body.id }, function (err, result) {
    if (result) {
      postProfile
        .find({}, function (err, posts) {
          if (err) {
            console.log(err);
          }

          res.json({ status: true, userData: result, trendData: posts });
        })
        .sort({ postTime: -1 });
    }
  });
});

app.post("/manualChangePassword", (req, res) => {

  userProfile.findOne({ email: req.body.email }, function (err, result) {
    if (err) {
      console.log("Cannot change password manually");
    }
    else {
      console.log("Called successfully");
      res.json({ status: true, userData: result });
    }

  });

});

app.post("/deleteDb", (req, res) => {

  userProfile.findOne({ username: req.body.username }, function (err, result) {
    if (err) {
      console.log(err)
    }

    else {
      console.log("result", result)
      result.remove()
    }
  })
})

app.use((error, req, res, next) => {
  console.log(error);
  res.sendStatus(error.status || 500);
});

app.listen(port, () => {
  console.log("Server listening to port " + port);
});
