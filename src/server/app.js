

// Starting point of the application
var util = require("./util");
var express = require("express");
var app = express();
var path = require("path");
var port = 5000;
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
          comment: String,
          username: String,
          postTime: String
        }
      ]
    }
  ]
});

var postSchema = new mongoose.Schema({
  username: String,
  topic: String,
  description: String,
  postTime: Number,
  userid: String,
  postid: String,
  comments: [
    {
      userId: String,
      comment: String
    }
  ]
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
  var verificationCode = util.sendMail(req.body.email);

  console.log(verificationCode);

  var user = new userProfile(req.body);
  user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8));
  user.code = verificationCode;
  user.save();


  res.send({ status: true, email: req.body.email, userData: user });
});

//Fetching the id to the local host

app.post("/signupverification", (req, res) => {
  console.log("email", req.body.email)
  userProfile.findOne({ _id: req.body.email }, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("id", result)
      res.send({ id: result._id });
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
        next({ status: 401, message: "Verification code is incorrect" });
      }
    } else {
      next({ status: 401, message: "Verification code is incorrect" });
    }
  });
});

/*login
 */



app.post("/home", (req, res, next) => {
  userProfile.findOne({ username: req.body.username }, function (err, result) {

    if (result) {

      if (bcrypt.compareSync(req.body.password, result.password)) {

        postProfile
          .find({}, function (err, posts) {
            if (err) {
              console.log(err);
            }


            res.json({ status: true, userData: result, trendData: posts });
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

app.post("/newdiscussion", (req, res, next) => {
  res.send({ status: true });
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

    result.save();

    req.body.postid = result.post[0]._id;

    var post = new postProfile(req.body);
    post.save();


    res.json({ status: true, postData: result });

  });
});

app.post("/newcreate", (req, res) => {
  postProfile
    .find({}, function (err, posts) {
      if (err) {
        console.log(err);
      }

      res.json({ trendData: posts });
    })
    .sort({ postTime: -1 });
});

app.post("/cancelDiscussion", (req, res) => {
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

        res.send({ status: true, userdata: result });
      } else {
        res.send({ status: false });

      }
    } else {
      console.log("email doesn't exist in database");
    }
  });
});

app.post("/changepassword", (req, res) => {
  userProfile.findOne({ email: req.body.email }, function (err, user) {
    if (user) {
      user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8));

      user.save();

      postProfile
        .find({}, function (err, posts) {
          if (err) {
            console.log(err);
          }


          res.json({ status: true, userData: user, trendData: posts });
        })
        .sort({ postTime: -1 });


    }
  });
});


app.post('/editpage', (req, res) => {
  postProfile.findOne({ postid: req.body.postId }, function (err, result) {

    if (result) {
      console.log("server", result)

      res.json({ status: true, topic: result.topic, description: result.description });
    }
  })

}
)

app.post('/editdiscussion', (req, res) => {


  postProfile.findOne({ postid: req.body.postId }, function (err, post1) {
    if (post1) {

      post1.topic = req.body.topic;
      post1.description = req.body.description;
      post1.postTime = req.body.postTime;
      post1.save();

      userProfile.findOne({ _id: req.body.userId }, function (err, user) {
        if (user) {

          for (var i = 0; i < user.post.length; i++) {
            if (req.body.postId == user.post[i]._id) {
              user.post[i].postTime = req.body.postTime;
              user.post[i].topic = req.body.topic;
              user.post[i].description = req.body.description;
              user.save();
            }
          }
          postProfile.find({}, function (err, result) {
            res.json({ status: true, userData: user, trendData: result })
          }).sort({ postTime: -1 });

        }
        else
          console.log("no user")
      }).sort({ postTime: -1 });

    }
  })


})

app.post("/delete", (req, res) => {
  postProfile.findOne({ postid: req.body.postId }, function (err, post1) {
    if (post1) {
      console.log(post1);
      post1.remove();

      userProfile.findOne({ _id: req.body.userId }, function (err, user) {
        if (user) {

          for (var i = 0; i < user.post.length; i++) {
            if (req.body.postId == user.post[i]._id) {
              console.log("b", user.post[i])
              user.post[i].remove();
              user.save();
            }
          }
          postProfile.find({}, function (err, result) {
            res.json({ status: true, userData: user, trendData: result })
          })

        }
        else
          console.log("no user")
      })

    }
  })

})


app.post("/comment", (req, res) => {
  postProfile.findOne({ postid: req.body.postId }, function (err, user) {
    console.log("user", user)
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

app.post("/middleRender", (req, res) => {
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

app.post("/middleRender1", (req, res) => {

  postProfile.findOne({ _id: req.body.id }, function (err, user) {

    if (user) {
      userProfile.findOne({ username: user.username }, function (err, result) {
        res.send({ trendData: user, userData: result });
      });
    }
  });
});


app.post("/search", (req, res) => {
  var s = req.body.search;

  postProfile.find({ topic: { $regex: '.*' + s + '.*' ,'$options' : 'i' } }, function (err, search) {
    if (err) {
      console.log("err in search");
    }
    if (search) {
   
  // userProfile.findOne({ username: search.username }, function(err, user) {
  //   for (var i = 0; i < user.post.length; i++) {
  //     if (
  //       JSON.stringify(user.post[i]._id) === JSON.stringify(search.postid)
  //     ) {
  //       res.send({ status:true,username: search.username, postData: user.post[i] });
  //       console.log(postData)
  //       break;
  //     }

  //   }
  // });

  res.send({ status:true, postData: search });


}
    else
  res.send({ status: false })
  }).sort({ postTime: -1 });
});





app.post("/settings", (req, res) => {

  res.send({ status: true });
  console.log("Setting in server side");

});

///////////////Logout

app.post("/logout", (req, res) => {

  res.send({ status: true });

  console.log("logout successfully");

});

//////////move to home

app.get("/restore", (req, res) => {

  res.send({ status: true });
});



// Go to Main Page

app.post('/homePage', (req, res) => {
  console.log("Go to Main Page successfully done!");
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
















app.use((error, req, res, next) => {
  console.log(error);
  res.sendStatus(error.status || 500);
});

app.listen(port, () => {
  console.log("Server listening to port " + port);
});

















