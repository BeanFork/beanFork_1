var localUser;
var localId;
var postId;
var token = localStorage.getItem("token");
var localData;
var localUsername;
var localMail;
var mailCheck,
  userCheck,
  count = 0;
var flag = false;
var likeStatus = false;

// FORGOT PASSWORD
function forgotPassword() {
  superagent.post("/forgotPassword").end(function (err, result) {
    if (err) {
      console.log(err);
    }

    if (result.status) {
      $(document).ready(function () {
        $("#container1").load(
          "../../views/forgot-password.html",
          function () { }
        );
      });
    }
  });
}

function sendCode() {
  superagent
    .post("/sendcode")
    .send({
      email: document.getElementById("input-email").value
    })
    .end(function (err, result) {
      var res = JSON.parse(result.text);

      if (err) {
        console.log(err);
      }
      if (res.status) {
        document.getElementById("sendcode1").classList.add("hide");

        document.getElementById("sendcode1").classList.remove("show");

        document.getElementById("sendcode2").classList.add("show");
        document.getElementById("sendcode2").classList.remove("hide");
      } else document.getElementById("Emailspan").innerHTML = "<p>Email address doesn't exist</p>";
    });
}

function confirmCode() {
  localMail = document.getElementById("input-email").value;
  superagent
    .post("/submitcode")
    .send({
      code: document.getElementById("input-code").value,
      email: document.getElementById("input-email").value
    })
    .end(function (err, result) {
      var res = JSON.parse(result.text);

      if (res.status) {
        localUser = res.userData;
        $(document).ready(function () {
          $("#container1").load("../../views/change-password.html", function () {

            localUsername = res.username;

          });
        });
      } else {
        console.log("Wrong code", res.status);
        $(document).ready(function () {
          $("#container1").load("../../views/forgot-password.html", function () {
            document.getElementById("Emailspan").innerHTML =
              "<p>Verification code is incorrect</p>";
          });
        });
      }
    });
}

function changePassword() {
  console.log("jwt pass", localUser.username);
  superagent
    .post("/changepassword")
    .send({
      password: document.getElementById("password").value,
      email: localUser.email,
      username: localUser.username
    })
    .end(function (err, result) {
      var res = JSON.parse(result.text);
      localId = res.userData._id;
      localUser = res.userData;


      if (err) {
        console.log(err, "err");
      }
      if (res.status) {
        $(document).ready(function () {
          $("#container1").load("../../views/home.html", function () {
            document.getElementById(
              "welcomeuser"
            ).innerHTML = `${localUser.username}`;


            localStorage.setItem("token", res.token);

            if (res.userData.post.length > 0) {
              postId = res.userData.post[0]._id;

              yourDiscussion(res.userData);
              middleRenderPost(
                res.userData.username,
                res.userData.post[0].topic,
                res.userData.post[0].description,
                res.userData.post[0].postTime,
                res.userData.post[0].comments
              );
            } else {
              console.log("No posts in the middle");
              middleRenderPost(
                res.trendData[0].username,
                res.trendData[0].topic,
                res.trendData[0].description,
                res.trendData[0].postTime,
                res.trendData[0].comments
              );
            }

            trendingTopics(res.trendData);
          });
        });
      }
    });
}

function cancelForgotPassword() {
  $(document).ready(function () {
    $("#container1").load("../../views/register.html", function () { });
  });
}

// SIGN UP

function signup() {
  var username = document.getElementById("username").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  document.getElementById("username").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("confirmpassword").value = "";
  document.getElementById("signupcontainer").classList.add("hide");

  document.getElementById("signupcontainer").classList.remove("show");

  document.getElementById("new1").classList.add("show");
  document.getElementById("new1").classList.remove("hide");

  superagent
    .post("/signup")
    .send({
      username: username,
      email: email,
      password: password
    })
    .end(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        var res = JSON.parse(result.text);

        console.log("result", res);

        localUser = res.userData;

        if (res.status) {
          signupVerification(res.userData._id);
        }
      }
    });
}
function signupVerification(email) {
  console.log("email", email);
  superagent
    .post("/signupverification")
    .send({ email: email })
    .end(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        var res = JSON.parse(result.text);
        localId = res.id;
       
        localStorage.setItem("token", res.token);
      }
    });
}

function mailidFormat() {
  var email = document.getElementById("email").value;
  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if (reg.test(email) === false) {
    document.getElementById("idValidation").innerHTML =
      "<p>Enter valid Email address</p>";
  } else {
    document.getElementById("idValidation").innerHTML = " ";
    var result = emailExistence();
    return result;
  }
}

function usernameLength() {
  var usernamelength = document.getElementById("username").value.length;
  var usernameRegex = /^[a-zA-Z0-9]{5,}$/;

  if (usernamelength < 5) {
    document.getElementById("usernamecheck").innerHTML =
      "<p>Username must contain a minimum of 5 characters</p>";
  } else {
    var result = userExistence();
    return result;
  }
}

function userExistence() {
  superagent
    .post("/user")
    .send({
      username: document.getElementById("username").value
    })
    .end(function (err, result) {
      var res = JSON.parse(result.text);

      if (res.status) {
        document.getElementById("usernamecheck").innerHTML =
          "<p>Username already exists</p>";
        userCheck = false;
      } else {
        document.getElementById("usernamecheck").innerHTML = "<p>Unique!!!</p>";
        userCheck = true;
      }
    });
  return userCheck;
}

function emailExistence() {
  superagent
    .post("/email")
    .send({ email: document.getElementById("email").value })
    .end(function (err, result) {
      var res = JSON.parse(result.text);

      if (res.status) {
        document.getElementById("emailcheck").innerHTML =
          "<p>Email already exists</p>";
        mailCheck = false;
      } else {
        document.getElementById("emailcheck").innerHTML = "";
        mailCheck = true;
      }
    });
  return mailCheck;
}

function verificationConfirm() {
  var id = localId;

  if (count < 2) {

    superagent
      .post("/code")
      .send({ code: document.getElementById("Confirmcode").value, id: id })
      .end(function (err, result) {
        if (err) {
          console.log(err);
        } else {
          var res = JSON.parse(result.text);

          if (res.status) {
            $(document).ready(function () {
              $("#container1").load("/views/home.html", function () {
                document.getElementById(
                  "welcomeuser"
                ).innerHTML = `${localUser.username}`;

                if (res.userData.post.length > 0) {
                  yourDiscussion(res.userData);
                } else {
                  document.getElementById("yourdiscussion").innerHTML = "";
                  const markup = `<br><br><br><span id = "message-yourdiscussion" style = "text-align: center; color: white;"> 
                You have not created any discussions yet </span> `;
                  document
                    .getElementById("yourdiscussion")
                    .insertAdjacentHTML("beforeend", markup);
                }
                middleRenderPost(
                  res.trendData[0].username,
                  res.trendData[0].topic,
                  res.trendData[0].description,
                  res.trendData[0].postTime,
                  res.trendData[0].comments
                );
                trendingTopics(res.trendData);
              });
            });
          } else {


            document.getElementById(
              "verificationcomment"
            ).innerHTML = `<p>Verification code is incorrect!!!!${2 -
            count} attempts more </p>`;
            count = count + 1;
          }
        }
      });
  } else {

    superagent.post("/deleteDb").send({ username: localUser.username }).end(function (err, result) {

    });

    document.getElementById("new1").classList.add("hide");

    document.getElementById("new1").classList.remove("show");

    document.getElementById("signupcontainer").classList.add("show");
    document.getElementById("signupcontainer").classList.remove("hide");
  }
}

// LOGIN

function login() {
  var username = document.getElementById("loginUsername").value;
  var password = document.getElementById("loginPassword").value;
  if (username !== "" && password !== "") {
    document.getElementById("loginUsername").value = "";
    document.getElementById("loginPassword").value = "";
    superagent
      .post("/home")
      .send({
        username: username,
        password: password
      })
      .end(function (err, result) {
        if (err) {
          console.log(err);
          document.getElementById("loginverification").innerHTML =
            "<p>Username or password is incorrect</p>";
        } else {
          var res = JSON.parse(result.text);
          
          localUser = res.userData;

          localId = res.userData._id;
          if (res.status) {
            $(document).ready(function () {
              $("#container1").load("/views/home.html", function () {
                document.getElementById(
                  "welcomeuser"
                ).innerHTML = `${localUser.username}`;

                localStorage.setItem("token", res.token);

                if (res.userData.post.length > 0) {
                  yourDiscussion(res.userData);
                } else {
                  document.getElementById("yourdiscussion").innerHTML = "";
                  const markup = `<br><br><br><span id = "message-yourdiscussion" style = "text-align: center;
                 color: white;"> You have not created any discussions yet </span> `;
                  document
                    .getElementById("yourdiscussion")
                    .insertAdjacentHTML("beforeend", markup);
                }
                postId = res.trendData[0].postid;
                middleRenderPost(
                  res.trendData[0].username,
                  res.trendData[0].topic,
                  res.trendData[0].description,
                  res.trendData[0].postTime,
                  res.trendData[0].comments
                );

                trendingTopics(res.trendData);
              });
            });
          }
        }
      });
  } else {
    document.getElementById("loginverification").innerHTML =
      "<p>Username or password is incorrect</p>";
  }
}

// NEW DISCUSSION

function newDiscussion() {
  var token = localStorage.getItem("token");
  superagent
    .post("/newdiscussion")
    .set("token", token)
    .end(function (err, result) {
      if (err) {

        $("#container1").load("/views/logout.html", function () {
          document.getElementById("welcome").innerHTML = " ";

          document.getElementById("welcome").innerHTML = "session expired";
        });
      } else {
        var res = JSON.parse(result.text);

        if (res.status) {
          $(document).ready(function () {
            $("#container1").load("/views/new-discussion.html", function () {
              document.getElementById(
                "welcomeuser"
              ).innerHTML = `${localUser.username}`;
            });
          });
        }
      }
    });
}

// CANCEL DISCUSSION

function cancelDiscussion() {
  superagent
    .post("/cancelDiscussion")
    .set("token", token)
    .send({ username: localUser.username })

    .end(function (err, result) {
      if (err) {

        $("#container1").load("/views/logout.html", function () {
          document.getElementById("welcome").innerHTML = " ";

          document.getElementById("welcome").innerHTML = "session expired";
        });
      } else {
        var res = JSON.parse(result.text);

        $(document).ready(function () {
          $("#container1").load("/views/home.html", function () {
            document.getElementById(
              "welcomeuser"
            ).innerHTML = `${localUser.username}`;
            if (res.userData.post.length > 0) {
              yourDiscussion(res.userData);
            } else {
              document.getElementById("yourdiscussion").innerHTML = "";
              const markup = `<br><br><br><span id = "message-yourdiscussion" style = "text-align: center; 
              color: white;"> You have not created any discussions yet </span> `;
              document
                .getElementById("yourdiscussion")
                .insertAdjacentHTML("beforeend", markup);
            }
            middleRenderPost(
              res.trendData[0].username,
              res.trendData[0].topic,
              res.trendData[0].description,
              res.trendData[0].postTime,
              res.trendData[0].comments
            );
            trendingTopics(res.trendData);
          });
        });
      }
    });
}

//CREATE DISCUSSION

function createDiscussion() {
  var topic = document.getElementById("discussionTopic").value;
  var description = document.getElementById("discussionDescription").value;
  var postTime = Date.parse(new Date());

  var id = localId;
  var username = localUser.username;

  if (topic.length > 0 && description.length > 0) {
    superagent
      .post("/creatediscussion")
      .set("token", token)
      .send({
        topic: topic,
        description: description,
        userid: id,
        id: id,
        postTime: postTime,
        username: username
      })
      .end(function (err, result) {
        if (err) {

          $("#container1").load("/views/logout.html", function () {
            document.getElementById("welcome").innerHTML = " ";

            document.getElementById("welcome").innerHTML = "session expired";
          });
        } else {
          var res = JSON.parse(result.text);
          postId = res.postData.post[0]._id;
          if (res.status) {
            $(document).ready(function () {
              $("#container1").load("/views/home.html", function () {
                document.getElementById(
                  "welcomeuser"
                ).innerHTML = `${localUser.username}`;

                middleRenderPost(
                  res.postData.username,
                  res.postData.post[0].topic,
                  res.postData.post[0].description,
                  res.postData.post[0].postTime,
                  res.postData.post[0].comments
                );
                yourDiscussion(res.postData);
                superagent
                  .post("/newcreate")
                  .set("token", token)
                  .end(function (err, result) {
                    if (err) {

                      $("#container1").load("/views/logout.html", function () {
                        document.getElementById("welcome").innerHTML = " ";

                        document.getElementById("welcome").innerHTML =
                          "session expired";
                      });
                    } else {
                      var res = JSON.parse(result.text);

                      trendingTopics(res.trendData);
                    }
                  });
              });
            });
          }
        }
      });
  } else
    document.getElementById("discussion").innerHTML =
      "<p>***Both the fields are mandatory</p>";
}



function trendingTopics(posts) {


  for (var i = 0; i < posts.length; i++) {
    const markup = `
    <div class = "trendingTemplate"> 
    <a onclick="getAttributes1(this)" class="results__link" href= "#${posts[i]._id}" style = "color:rgb(199, 247, 255); text-decoration: none;">
    <article class="topic">
    <div style="font-size:25px; "> ${posts[i].topic}</div> posted by ${posts[i].username}
    </article>
    </a>
    </div>
  
    
  `;
    document
      .getElementById("TrendDiscussion")
      .insertAdjacentHTML("beforeend", markup);
  }
}

function getAttributes1(item) {
  var urlArray = item.href.toString().split("#");

  var id = urlArray[1];
  var token = localStorage.getItem("token");
  superagent
    .post("/middleRender1")
    .send({ id: id })
    .set("token", token)
    .end(function (err, result) {
      if (err) {

        $("#container1").load("/views/logout.html", function () {
          document.getElementById("welcome").innerHTML = " ";

          document.getElementById("welcome").innerHTML = "session expired";
        });
      } else {
        var res = JSON.parse(result.text);

        postId = res.trendData.postid;

        for (var i = 0; i < res.userData.post.length; i++) {
          if (res.userData.post[i]._id === postId) {
            middleRenderPost(
              res.userData.username,
              res.userData.post[i].topic,
              res.userData.post[i].description,
              res.userData.post[i].postTime,
              res.userData.post[i].comments,
              false
            );
          }
        }
      }
    });
}

// MIDDLE RENDERING

function middleRenderPost(
  username,
  topic,
  description,
  postTime,
  comments,
  status
) {
  console.log("status", status, "username", username);
  document.getElementById("post_content").innerHTML = "";
  document.getElementById("comment_content").innerHTML = "";
  var time = calculateTime(postTime);

  const markup = `<h1 style = "white-space:pre"> ${topic}</h1>
  <article class="post">
  <h5>posted by ${username}</h5>
  
  <font size="2">${time}</font></br>
  <font size="4" class="content">
  ${description}
  </font>
  <div id = "likeSection">
  <a href = "#" id = "likePost" onclick = "likePost()"> <i id ="likeIcon" class = "fa fa-thumbs-o-up" aria-hidden = "true"></i>Like</a>
  <a href = "#" id = "addComment" onclick = "showCommentBox()" ><i class = "fa fa-comment" aria-hidden ="true"> </i>Comment</a>
  </div>
  
  <div id= "commentSection">
  </div>`;
  document
    .getElementById("post_content")
    .insertAdjacentHTML("afterbegin", markup);

  if (comments.length > 0) {
    document.getElementById("comment_content").classList.add("comment_content");
    for (var i = 0; i < comments.length; i++) {
      const markup1 = ` <h4>${comments[i].username}</h4>
  <h5>${comments[i].comment}</h5> <hr>`;
      document
        .getElementById("comment_content")
        .insertAdjacentHTML("afterbegin", markup1);
    }
  } else {
    document
      .getElementById("comment_content")
      .classList.remove("comment_content");
  }

  if (localUser.username === username) {


    const buttons123 = deleteButton();
    document
      .getElementById("delete1")
      .insertAdjacentHTML("beforeend", buttons123);

    const buttonsEdit = editButton();
    document
      .getElementById("edit1")
      .insertAdjacentHTML("beforeend", buttonsEdit);
  } else {

    document.getElementById("delete1").innerHTML = "";

    document.getElementById("edit1").innerHTML = "";
  }
}

//EDIT
function editButton() {
  document.getElementById("edit1").innerHTML = "";

  const markup = `<button class="btn" style="background-color:lightblue " onclick="editAction()">  
  <span><i class="glyphicon glyphicon-pencil" style="font-size:20px;color:black;text-shadow:2px 2px 4px #000000;"></i></span></button>`;
  return markup;
}

//EDIT ACTION

function editAction() {
  var token = localStorage.getItem("token");
  superagent
    .post("/editpage")
    .set("token", token)
    .send({ postId: postId, userId: localId })
    .end(function (err, result) {
      if (err) {

        $("#container1").load("/views/logout.html", function () {
          document.getElementById("welcome").innerHTML = " ";

          document.getElementById("welcome").innerHTML = "session expired";
        });
      }

      if (result) {
        var res = JSON.parse(result.text);
        if (res.status) {
          $(document).ready(function () {
            $("#container1").load("/views/edit-discussion.html", function () {
              document.getElementById(
                "welcomeuser"
              ).innerHTML = `${localUser.username}`;


              document.getElementById("edit-discussionTopic").value = res.topic;
              document.getElementById("edit-discussionDescription").value =
                res.description;

            });
          });
        }
      }
    });
}

function editDiscussion() {

  var topic = document.getElementById("edit-discussionTopic").value;
  var description = document.getElementById("edit-discussionDescription").value;
  var postTime = Date.parse(new Date());

  var token = localStorage.getItem("token");
  var username = localUser.username;

  if (topic.length > 0 && description.length > 0) {
    superagent
      .post("/editdiscussion")
      .set("token", token)
      .send({
        topic: topic,
        description: description,
        postId: postId,
        userId: localId,
        postTime: postTime,
        username: username
      })
      .end(function (err, result) {
        if (err) {

          $("#container1").load("/views/logout.html", function () {
            document.getElementById("welcome").innerHTML = " ";

            document.getElementById("welcome").innerHTML = "session expired";
          });
        } else {
          var res = JSON.parse(result.text);

          if (res.status) {


            $(document).ready(function () {
              $("#container1").load("/views/home.html", function () {
                document.getElementById(
                  "welcomeuser"
                ).innerHTML = `${localUser.username}`;

                for (var j = 0; j < res.userData.post.length; j++) {
                  if (res.userData.post[j]._id === postId) {
                    middleRenderPost(
                      res.userData.username,
                      res.userData.post[j].topic,
                      res.userData.post[j].description,
                      res.userData.post[j].postTime,
                      res.userData.post[j].comments
                    );
                  }
                }


                yourDiscussion(res.userData);
                trendingTopics(res.trendData);
              });
            });
          }
        }
      });
  } else
    document.getElementById("discussion").innerHTML =
      "<p>***Both the fields are mandatory</p>";
}

function deleteButton() {
  document.getElementById("delete1").innerHTML = "";

  const markup = `<button class="btn" style=" background-color:lightblue" onclick="deleteAction()">
  <span><i class="glyphicon glyphicon-trash" style="font-size:20px;color:black;text-shadow:2px 2px 4px #000000;"></i></span></button>`;
  return markup;
}

//pop up delete

function deletePopUP() {
  if (confirm("Are you sure you want to delete!")) {
    return (txt = "ok");
  } else {
    return (txt = "cancel");
  }
}

//DELETION ACTION

function deleteAction() {


  var answer = deletePopUP();

  if (answer === "ok") {

    document.getElementById("yourdiscussion").innerHTML = "";
    document.getElementById("TrendDiscussion").innerHTML = "";
    superagent
      .post("/delete")
      .set("token", token)
      .send({ postId: postId, userId: localId })
      .end(function (err, result) {
        if (err) {

          $("#container1").load("/views/logout.html", function () {
            document.getElementById("welcome").innerHTML = " ";

            document.getElementById("welcome").innerHTML = "session expired";
          });
        }
        var res = JSON.parse(result.text);

        if (res.status) {

          if (res.userData.post.length > 0) {
            yourDiscussion(res.userData);
            postId = res.userData.post[0]._id;
          } else {
            document.getElementById("yourdiscussion").innerHTML = "";
            const markup = `<br><br><br><span id = "message-yourdiscussion" style = "text-align: center;
  color: white;"> You have not created any discussions yet </span> `;
            document
              .getElementById("yourdiscussion")
              .insertAdjacentHTML("beforeend", markup);
          }
          middleRenderPost(
            res.trendData[0].username,
            res.trendData[0].topic,
            res.trendData[0].description,
            res.trendData[0].postTime,
            res.trendData[0].comments,
            true
          );

          trendingTopics(res.trendData);
        } else {
          console.log("status:false");
        }
      });
  } else console.log("nothing is deleted ");
}

function yourDiscussion(postData) {
  var posts = postData.post;

  for (var i = 0; i < posts.length; i++) {
    var time = calculateTime(posts[i].postTime);
    var description = posts[i].description;

    if (description.length > 40) {
      description = description.slice(0, 80) + "...";
    }
    const markup = `
  <div class = "template"> 
  <a  onclick="getAttributes(this)" class = "results__link" href= "#${posts[i]._id}" style = "color:rgb(199, 247, 255); text-decoration: none;">
  <article class="topic">

  <div style="font-size:25px; "> ${posts[i].topic}</div>  <div style="text-align:right;">${time}</div>
    <p style="font-size:18px;"> 

    ${description}
    </p>
    </article>
    </a>
    </div>
`;

    document
      .getElementById("yourdiscussion")
      .insertAdjacentHTML("beforeend", markup);
  }
}

function getAttributes(item) {
  var urlArray = item.href.toString().split("#");
  var token = localStorage.getItem("token");
  postId = urlArray[1];

  superagent
    .post("/middleRender")
    .set("token", token)
    .send({ postId: postId, userId: localId })
    .end(function (err, result) {
      if (err) {

        $("#container1").load("/views/logout.html", function () {
          document.getElementById("welcome").innerHTML = " ";

          document.getElementById("welcome").innerHTML = "session expired";
        });
      } else {
        var res = JSON.parse(result.text);
        middleRenderPost(
          res.username,
          res.userData.topic,
          res.userData.description,
          res.userData.postTime,
          res.userData.comments,
          true
        );
      }
    });
}

// CALCULATING POST TIME

function calculateTime(postTime) {
  var currentTime = Date.parse(new Date());
  var diff = currentTime - postTime;
  var secs = Math.floor(diff / 1000);
  var hours = Math.floor(diff / 1000 / 60 / 60);
  var minutes = Math.floor(diff / 1000 / 60);

  if (hours == 0 && minutes == 0) {
    if (secs == 0) var time = "Just now";
    else if (secs == 1) var time = " 1 second ago";
    else var time = secs + " seconds ago";
  } else if (hours == 0 && minutes > 0) {
    if (minutes == 1) {
      var time = "1 minute ago";
    }
    var time = minutes + " minutes ago";
  } else if (hours > 0) {
    if (hours == 1) {
      var time = "1 hour ago";
    }
    var time = hours + " hours ago";
  }

  return time;
}

// ADD NEW COMMENTS
function addComment() {
  var comment = document.getElementById("commentBox").value;
  document.getElementById("commentBox").value = "";
  var username = localUser.username;


  if (comment != "") {
    superagent
      .post("/comment")
      .set("token", token)
      .send({ comment: comment, username: username, postId: postId })
      .end(function (err, result) {
        if (err) {

          $("#container1").load("/views/logout.html", function () {
            document.getElementById("welcome").innerHTML = " ";

            document.getElementById("welcome").innerHTML = "session expired";
          });
        } else {
          var res = JSON.parse(result.text);

          middleRenderPost(
            res.username,
            res.postData.topic,
            res.postData.description,
            res.postData.postTime,
            res.postData.comments
          );
        }
      });
  }
  flag = true;
}

// SEARCH BAR

function searchKeyup() {
  var search = document.getElementById("search").value;

  if (search.length >= 3) {
    document.getElementById("btnSearch").disabled = false;
  } else {
    document.getElementById("btnSearch").disabled = true;
  }
}

function searchBar() {
  var search = document.getElementById("search").value;
  document.getElementById("post_content").innerHTML = "";
  document.getElementById("comment_content").innerHTML = "";
  //document.getElementById("comment_content").classList.add("comment_content");
  document
    .getElementById("comment_content")
    .classList.remove("comment_content");
  document.getElementById("delete1").innerHTML = "";
  document.getElementById("edit1").innerHTML = "";
  document.getElementById("search").value = "";


  superagent
    .post("/search")
    .send({ search: search })
    .set("token", token)
    .end(function (err, result) {
      if (err) {

        $("#container1").load("/views/logout.html", function () {
          document.getElementById("welcome").innerHTML = " ";

          document.getElementById("welcome").innerHTML = "session expired";
        });
      } else {
        var res = JSON.parse(result.text);

        if (res.status) {


          for (var i = 0; i < res.postData.length; i++) {
            const searchList = generateSearchList();
            // document
            //   .getElementById("myUL")
            //   .insertAdjacentHTML("beforeend", searchList);
            document
              .getElementById("post_content")
              .insertAdjacentHTML("afterbegin", searchList);

            function generateSearchList() {

              const markup = ` <ul>
<li><a onclick="getAttributes1(this)" class = "results__link" href= "#${res.postData[i]._id}" style="text-decoration: none;c
 "><div style="font-size:25px;
 color:black; "> ${res.postData[i].topic}</div> </a></li><hr style="border-top: 1px dotted black;"></ul>
      `;
              return markup;
            }
          }
        }

        if (res.status == false) {

          document.getElementById("post_content").innerHTML = "";
          const markup = `<h1>Topic doesn't exists</h1>`;
          document
            .getElementById("post_content")
            .insertAdjacentHTML("afterbegin", markup);
        }
      }

      //if (res.status == false)
      //document.getElementById('span-search').innerHTML = "Topic doesn't exist";
    });
}

/*
Go to Main Page 
*/
function homePage() {

  superagent
    .post("/homePage")
    .send({ id: localId })
    .set("token", token)
    .end(function (err, result) {
      var res = JSON.parse(result.text);
      if (err) {

        $("#container1").load("/views/logout.html", function () {
          document.getElementById("welcome").innerHTML = " ";

          document.getElementById("welcome").innerHTML = "session expired";
        });
      } else {
        $(document).ready(function () {
          $("#container1").load("../../views/home.html", function () {
            document.getElementById(
              "welcomeuser"
            ).innerHTML = `${localUser.username}`;

            //postId = res.userData.post[0]._id;
            if (res.userData.post.length > 0) {
              yourDiscussion(res.userData);
            } else {
              document.getElementById("yourdiscussion").innerHTML = "";
              const markup = `<br><br><br><span id = "message-yourdiscussion" style = "text-align: center;
             color: white;"> You have not created any discussions yet </span> `;
              document
                .getElementById("yourdiscussion")
                .insertAdjacentHTML("beforeend", markup);
            }
            middleRenderPost(
              res.trendData[0].username,
              res.trendData[0].topic,
              res.trendData[0].description,
              res.trendData[0].postTime,
              res.trendData[0].comments
            );

            trendingTopics(res.trendData);
          });
        });
      }
    });
}

function showCommentBox() {
  const markup = `
  <textarea
  id="commentBox"
  class="comment"
  rows="2"
  cols="60"
  placeholder="Write Comments..."
  onkeydown="if (event.keyCode == 13)
  document.getElementById('button-add').click()"
  ></textarea>
  <button
  id="button-add"
  onclick= "addComment()"
  >Add
  </button>
  <button
  style = "margin-bottom: 0%;"
  id="button-cancel"
  onclick="cancelComment()"
  >
  Cancel
  </button>
  `;

  if (flag) {
    document
      .getElementById("commentSection")
      .insertAdjacentHTML("beforeend", markup);
    flag = false;
  } else {
    flag = false;
    cancelComment();
  }
}

function cancelComment() {
  flag = true;
  document.getElementById("commentSection").innerHTML = " ";
}

function likePost() {
  likeStatus = true;
  document.getElementById("likeSection").innerHTML = " ";

  if (likeStatus) {
    const markup = `
  <a href = "#" id = "likePost" onclick = "unlikePost()"> <i id ="likeIcon" class = "fa fa-thumbs-up" aria-hidden = "true"></i>Unlike</a>
  <a href = "#" id = "addComment" onclick = "showCommentBox()" ><i class = "fa fa-comment" aria-hidden ="true"> </i>Comment</a>

  
  <div id= "commentSection">
  </div>`;
    document
      .getElementById("likeSection")
      .insertAdjacentHTML("afterbegin", markup);

    var icon = document.getElementById("likeIcon");

    // icon.classList.toggle("fa-thumbs-up");
  }
}

function unlikePost() {
  likeStatus = false;

  if (!likeStatus) {
    document.getElementById("likeSection").innerHTML = " ";

    const markup = `
    <a href = "#" id = "likePost" onclick = "likePost()"> <i id ="likeIcon" class = "fa fa-thumbs-o-up" aria-hidden = "true"></i>Like</a>
    <a href = "#" id = "addComment" onclick = "showCommentBox()" ><i class = "fa fa-comment" aria-hidden ="true"> </i>Comment</a>

    <div id= "commentSection">
    </div>`;
    document
      .getElementById("likeSection")
      .insertAdjacentHTML("afterbegin", markup);

    var icon = document.getElementById("likeIcon");

    // icon.classList.toggle("fa-thumbs-up");
  }
}

function changePasswordManual() {

  superagent
    .post("/manualChangePassword")
    .send({ email: localUser.email })
    .end(function (err, result) {
      console.log(result);
      if (result) {
        var res = JSON.parse(result.text);

        if (res.status) {
          localUser = res.userData;

          $(document).ready(function () {
            $("#container1").load(
              "../../views/change-password.html",
              function () { }
            );
          });
        }
      }
    });
}

/*
Go to Main Page 
*/
function homePage() {

  superagent
    .post("/homePage")
    .send({ id: localUser._id })
    .set("token", token)
    .end(function (err, result) {
      var res = JSON.parse(result.text);
      if (err) {

        $("#container1").load("/views/logout.html", function () {
          document.getElementById("welcome").innerHTML = " ";

          document.getElementById("welcome").innerHTML = "session expired";
        });
      }
      $(document).ready(function () {
        $("#container1").load("../../views/home.html", function () {
          document.getElementById(
            "welcomeuser"
          ).innerHTML = `${localUser.username}`;
          if (res.userData.post.length > 0) {
            yourDiscussion(res.userData);
          } else {
            document.getElementById("yourdiscussion").innerHTML = "";
            const markup = `<br><br><br><span id = "message-yourdiscussion" style = "text-align: center;
         color: white;"> You have not created any discussions yet </span> `;
            document
              .getElementById("yourdiscussion")
              .insertAdjacentHTML("beforeend", markup);
          }
          postId = res.trendData[0].postid;
          middleRenderPost(
            res.trendData[0].username,
            res.trendData[0].topic,
            res.trendData[0].description,
            res.trendData[0].postTime,
            res.trendData[0].comments
          );

          trendingTopics(res.trendData);
        });
      });
    });
}
