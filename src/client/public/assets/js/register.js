var localUser;
var localId;
var postId;
var localData;
var localMail;
var mailCheck,
  userCheck,
  count = 0;

// FORGOT PASSWORD
function forgotPassword() {
  superagent.post("/forgotPassword").end(function(err, result) {
    if (err) {
      console.log(err);
    }

    if (result.status) {
      $(document).ready(function() {
        $("#container1").load("../../views/forgot-password.html",
          function() {}
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
    .end(function(err, result) {
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
    .end(function(err, result) {
      var res = JSON.parse(result.text);

      if (res.status) {
        localUser = res.userData;
        $(document).ready(function() {
          $("#container1").load(
            "../../views/change-password.html #container2",
            function() {
              console.log("change password");
            }
          );
        });
      } else {
        console.log("Wrong code", res.status);
        $(document).ready(function() {
          $("#container1").load("../../views/forgot-password.html", function() {
            document.getElementById("Emailspan").innerHTML =
              "<p>Verification code is incorrect</p>";
          });
        });
      }
    });
}

function changePassword() {
  superagent
    .post("/changepassword")
    .send({
      password: document.getElementById("password").value,
      email: localMail
    })
    .end(function(err, result) {
      var res = JSON.parse(result.text);
      localId = res.userData._id;
      localUser = res.userData;

      console.log("useData", res.userData);

      if (res.status) {
        $(document).ready(function() {
          $("#container1").load("../../views/home.html", function() {
            document.getElementById(
              "welcomeuser"
            ).innerHTML = `${localUser.username}`;

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
  $(document).ready(function() {
    $("#container1").load("../../views/register.html", function() {});
  });
}

// SIGN UP

function signup() {
  
  var username = document.getElementById("username").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  document.getElementById("username").value ="";
  document.getElementById("email").value ="";
  document.getElementById("password").value="";
  document.getElementById("confirmpassword").value="";
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
    .end(function(err, result) {
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
    .end(function(err, result) {
      if (err) {
        console.log(err);
      } else {
        var res = JSON.parse(result.text);
        localId = res.id;
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
    .end(function(err, result) {
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
    .end(function(err, result) {
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
      .end(function(err, result) {
        if (err) {
          document.getElementById(
            "verificationcomment"
          ).innerHTML = `<p>Verification code is incorrect!!!!${2-count} attempts more </p>`;
          count = count + 1;
        } else {
          var res = JSON.parse(result.text);

          if (res.status) {
            $(document).ready(function() {
              $("#container1").load("/views/home.html", function() {
                document.getElementById(
                  "welcomeuser"
                ).innerHTML = `${localUser.username}`;

                if (res.userData.post.length > 0) {
                  yourDiscussion(res.userData);
                } else {
                  document.getElementById("yourdiscussion").innerHTML = "";
                  const markup = `<br><br><br><span id = "message-yourdiscussion" style = "text-align: center;"> 
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
          }
        }
      });
  } else {
    console.log("count", count);
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
  document.getElementById("loginUsername").value = "";
  document.getElementById("loginPassword").value = "";
  superagent
    .post("/home")
    .send({
      username: username,
      password: password
    })
    .end(function(err, result) {
      if (err) {
        console.log(err);
        document.getElementById("loginverification").innerHTML =
          "<p>Username or password is incorrect</p>";
      } else {
        var res = JSON.parse(result.text);

        localUser = res.userData;

        localId = res.userData._id;
        if (res.status) {
          $(document).ready(function() {
            $("#container1").load("/views/home.html", function() {
              document.getElementById(
                "welcomeuser"
              ).innerHTML = `${localUser.username}`;

              if (res.userData.post.length > 0) {
                yourDiscussion(res.userData);
              } else {
                document.getElementById("yourdiscussion").innerHTML = "";
                const markup = `<br><br><br><span id = "message-yourdiscussion" style = "text-align: center;"> You have not created any discussions yet </span> `;
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
}

// NEW DISCUSSION

function newDiscussion() {
  superagent.post("/newdiscussion").end(function(err, result) {
    var res = JSON.parse(result.text);

    if (res.status) {
      $(document).ready(function() {
        $("#container1").load("/views/new-discussion.html", function() {
          document.getElementById(
            "welcomeuser"
          ).innerHTML = `${localUser.username}`;
        });
      });
    }
  });
}

// CANCEL DISCUSSION

function cancelDiscussion() {
  superagent
    .post("/cancelDiscussion")
    .send({ username: localUser.username })

    .end(function(err, result) {
      if (err) {
        console.log(err);
      } else {
        var res = JSON.parse(result.text);
        console.log("trendData", res.userData);
        $(document).ready(function() {
          $("#container1").load("/views/home.html", function() {
            document.getElementById(
              "welcomeuser"
            ).innerHTML = `${localUser.username}`;
            if (res.userData.post.length > 0) {
              yourDiscussion(res.userData);
            } else {
              document.getElementById("yourdiscussion").innerHTML = "";
              const markup = `<br><br><br><span id = "message-yourdiscussion" style = "text-align: center;"> You have not created any discussions yet </span> `;
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
      .send({
        topic: topic,
        description: description,
        userid: id,
        id: id,
        postTime: postTime,
        username: username
      })
      .end(function(err, result) {
        if (err) {
          console.log(err);
        } else {
          var res = JSON.parse(result.text);
          postId = res.postData.post[0]._id;
          if (res.status) {
            $(document).ready(function() {
              $("#container1").load("/views/home.html", function() {
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
                superagent.post("/newcreate").end(function(err, result) {
                  var res = JSON.parse(result.text);

                  trendingTopics(res.trendData);
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

// TRENDING TOPICS RENDERING

// function trendingTopics(posts) {
//   renderPages(posts, 1, 5);
// }

// function renderPages(posts, page, postsPerPage) {
//   document.getElementById("Trending__pages").addEventListener("click", e => {
//     const btn = e.target.closest(".btn-trend");
//     if (btn) {
//       const gotoPage = parseInt(btn.dataset.goto, 10);
//       document.getElementById("TrendDiscussion").innerHTML = "";
//       document.getElementById("Trending__pages").innerHTML = "";
//       renderPages(posts, gotoPage, 5);
//     }
//   });
//   if (posts.length > postsPerPage) {
//     const starting = (page - 1) * postsPerPage;
//     const ending = page * postsPerPage;

//     posts.slice(starting, ending).forEach(renderTrendingPosts);
//     renderButtons1(page, posts.length, postsPerPage);
//   } else {
//     const starting = (page - 1) * postsPerPage;
//     const ending = page * postsPerPage;

//     posts.slice(starting, ending).forEach(renderTrendingPosts);
//   }
// }

function trendingTopics(posts) {
  console.log("post", posts);

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

  superagent
    .post("/middleRender1")
    .send({ id: id })
    .end(function(err, result) {
      if (err) {
        console.log(error);
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
  document.getElementById("post_content").innerHTML = "";
  document.getElementById("comment_content").innerHTML = "";
  var time = calculateTime(postTime);
  console.log("MidldleRender");
  const markup = `<h1 style = "white-space:pre"> ${topic}</h1>
  
  
  <article class="post"> 
  <h5>posted by ${username}</h5>

  <font size="2">${time}</font></br>
  <font size="4" class="content">
  ${description}
  </font>`;
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

  if (status || localUser.username === username) {
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

function editButton() {
  document.getElementById("edit1").innerHTML = "";

  const markup = `<button class="btn" style="background-color:lightblue " onclick="editAction()">  
 <span><i class="glyphicon glyphicon-pencil" style="font-size:20px;color:black;text-shadow:2px 2px 4px #000000;"></i></span></button>`;
  return markup;
}

//EDIT ACTION

function editAction() {
  superagent
    .post("/editpage")
    .send({ postId: postId, userId: localId })
    .end(function(err, result) {
      var res = JSON.parse(result.text);

      if (res.status) {
        $(document).ready(function() {
          $("#container1").load("/views/edit-discussion.html", function() {
            document.getElementById(
              "welcomeuser"
            ).innerHTML = `${localUser.username}`;

            console.log("cli", res.description);
            document.getElementById("edit-discussionTopic").value = res.topic;
            document.getElementById("edit-discussionDescription").value =
              res.description;
            console.log("edit page");
          });
        });
      }
    });
}

function editDiscussion() {
  //console.log("PostID to be edited", postId, res.userData.post);

  var topic = document.getElementById("edit-discussionTopic").value;
  var description = document.getElementById("edit-discussionDescription").value;
  var postTime = Date.parse(new Date());

  var username = localUser.username;

  if (topic.length > 0 && description.length > 0) {
    superagent
      .post("/editdiscussion")
      .send({
        topic: topic,
        description: description,
        postId: postId,
        userId: localId,
        postTime: postTime,
        username: username
      })
      .end(function(err, result) {
        if (err) {
          console.log(err);
        } else {
          var res = JSON.parse(result.text);

          if (res.status) {
            console.log("your dis", res.userData);
            console.log("tred disc", res.trendData);
            $(document).ready(function() {
              $("#container1").load("/views/home.html", function() {
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
                console.log("res.userData", res.userData);
                console.log("res.trendData", res.trendData);

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
  console.log("post id", postId);
  console.log("userid", localId);

  var answer = deletePopUP();

  if (answer === "ok") {
    console.log("deleted");
    document.getElementById("yourdiscussion").innerHTML = "";
    document.getElementById("TrendDiscussion").innerHTML = "";
    superagent
      .post("/delete")
      .send({ postId: postId, userId: localId })
      .end(function(err, result) {
        var res = JSON.parse(result.text);
        if (err) console.log("err");
        if (res.status) {
          console.log("your discussion", res.userData);
          console.log("trend topics", res.trendData);
          if (res.userData.post.length > 0) {
            yourDiscussion(res.userData);
            postId = res.userData.post[0]._id;
          } else {
            document.getElementById("yourdiscussion").innerHTML = "";
            const markup = `<br><br><br><span id = "message-yourdiscussion" style = "text-align: center;"> You have not created any discussions yet </span> `;
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
          console.log("res.userData", res.userData);
          console.log("res.trendData", res.trendData);
          trendingTopics(res.trendData);
        } else {
          console.log("status:false");
        }
      });
  } else console.log("nothing is deleted ");
}

// function yourDiscussion(postData) {
//   renderResults(postData.post, 1, 5);
// }

// function renderResults(posts, page, postsPerPage) {
//   document.getElementById("results__pages").addEventListener("click", e => {
//     const btn = e.target.closest(".btn-inline");
//     if (btn) {
//       const gotoPage = parseInt(btn.dataset.goto, 10);
//       document.getElementById("yourdiscussion").innerHTML = "";
//       document.getElementById("results__pages").innerHTML = "";
//       renderResults(localUser.post, gotoPage, 5);
//       discussionPage = gotoPage;
//     }
//   });

//   if (posts.length > postsPerPage) {
//     const starting = (page - 1) * postsPerPage;
//     const ending = page * postsPerPage;

//     posts.slice(starting, ending).forEach(renderPosts);
//     renderButtons(page, posts.length, postsPerPage);
//   } else {
//     const starting = (page - 1) * postsPerPage;
//     const ending = page * postsPerPage;

//     posts.slice(starting, ending).forEach(renderPosts);
//   }
// }

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

  postId = urlArray[1];

  superagent
    .post("/middleRender")
    .send({ postId: postId, userId: localId })
    .end(function(err, result) {
      if (err) {
        console.log(error);
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

// function renderButtons(page, numResults, resPerPage) {
//   const pages = Math.ceil(numResults / resPerPage);

//   let button;
//   if (page === 1 && pages > 1) {
//     button = createButton(page, "next");
//   } else if (page < pages) {
//     button = `${createButton(page, "prev")}
//   ${createButton(page, "next")}`;
//   } else if (page === pages && pages > 1) {
//     button = createButton(page, "prev");
//   }
//   document
//     .getElementById("results__pages")
//     .insertAdjacentHTML("afterbegin", button);
// }

// function createButton(page, type) {
//   const markup = `
//     <button class="btn-inline results__btn--${type}" data-goto=${
//     type === "prev" ? page - 1 : page + 1
//   }>
//     <span>${type === "prev" ? "Prev" : "Next"}</span>
//     </button>
//     `;
//   return markup;
// }

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

  console.log(localUser.username);

  superagent
    .post("/comment")
    .send({ comment: comment, username: username, postId: postId })
    .end(function(err, result) {
      if (err) {
        console.log(err);
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

// SEARCH BAR

function searchKeyup() {
  var search = document.getElementById("search").value;
  console.log("search length", search.length);
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
  //console.log("search text",search);

  superagent
    .post("/search")
    .send({ search: search })
    .end(function(err, result) {
      var res = JSON.parse(result.text);
      console.log(res, "res");
      if (res.status) {
        console.log(res.postData);

        for (var i = 0; i < res.postData.length; i++) {
          const searchList = generateSearchList();
          // document
          //   .getElementById("myUL")
          //   .insertAdjacentHTML("beforeend", searchList);
          document
            .getElementById("post_content")
            .insertAdjacentHTML("afterbegin", searchList);

          function generateSearchList() {
            console.log("res.postData[i]._id", res.postData[i]._id);
            const markup = ` <ul>
<li><a onclick="getAttributes1(this)" class = "results__link" href= "#${res.postData[i]._id}" ><div style="font-size:25px; "> ${res.postData[i].topic}</div> </a></li><hr></ul>
      `;
            return markup;
          }
        }
      }
      if (res.status == false) {
        console.log("not found");
        document.getElementById("post_content").innerHTML = "";
        const markup = `<h1>Topic doesn't exists</h1>`;
        document
          .getElementById("post_content")
          .insertAdjacentHTML("afterbegin", markup);
      }

      //if (res.status == false)
      //document.getElementById('span-search').innerHTML = "Topic doesn't exist";
    });
}

/*
Go to Main Page 
*/
function homePage() {
  console.log("homepage function called");
  superagent
    .post("/homePage")
    .send({ id: localId })
    .end(function(err, result) {
      var res = JSON.parse(result.text);
      if (err) {
        console.log(err);
      }
      $(document).ready(function() {
        $("#container1").load("../../views/home.html", function() {
          document.getElementById(
            "welcomeuser"
          ).innerHTML = `${localUser.username}`;

          //postId = res.userData.post[0]._id;
          if (res.userData.post.length > 0) {
            yourDiscussion(res.userData);
          } else {
            document.getElementById("yourdiscussion").innerHTML = "";
            const markup = `<br><br><br><span id = "message-yourdiscussion" style = "text-align: center;"> You have not created any discussions yet </span> `;
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
    });
}
