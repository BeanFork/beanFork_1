

var localUser;
var localId;
var postId;
var localdata;
var localmail;

// FORGOT PASSWORD
function forgotPassword() {
  superagent.post("/forgotPassword").end(function(err, result) {
    if (err) {
      console.log(err);
    }

    if (result.status) {
      $(document).ready(function() {
        $("#container1").load("/views/forgot-password.html", function() {});
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

      } else document.getElementById("Emailspan").innerHTML = "<p>email doesnt exist</p>";
    });
}

function confirmCode() {
  localmail = document.getElementById("input-email").value;
  superagent
    .post("/submitcode")
    .send({
      code: document.getElementById("input-code").value,
      email: document.getElementById("input-email").value
    })
    .end(function(err, result) {
      var res = JSON.parse(result.text);
      localUser = res.userdata;
      if (res.status) {
        $(document).ready(function() {
          $("#divcontainer").load(
            "../../views/change-password.html #container2",
            function() {
              document.getElementById(
                "welcomeuser"
              ).innerHTML = `<p> Welcome ${localUser.username}</p>`;
            }
          );
        });
      } else
        document.getElementById("Emailspan").innerHTML =
          "<p>Verification code is incorrect</p>";
    });
}

function changePassword() {
  superagent
    .post("/changepassword")
    .send({
      password: document.getElementById("password").value,
      email: localmail
    })
    .end(function(err, result) {
      var res = JSON.parse(result.text);
      localId = res.userData._id;
      localUser = res.userData;

      console.log("useData",res.userData)
      
      if (res.status) {
        $(document).ready(function() {
          $("#container2").load("../../views/home.html", function() {
            if(res.userData.post.length>0){
            postId = res.userData.post[0]._id;

            yourDiscussion(res.userData);
            middleRenderPost(
              res.userData.username,
              res.userData.post[0].topic,
              res.userData.post[0].description,
              res.userData.post[0].postTime,
              res.userData.post[0].comments
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
    $("#divcontainer").load("../../views/register.html", function() {});
  });
}

// SIGN UP

function signup() {
  var username = document.getElementById("username").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
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

        console.log("result",res);

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
      "<p>Enter valid input</p>";
  } else {
    document.getElementById("idValidation").innerHTML = " ";
    emailExistence();
  }
}

function usernameLength() {
  var usernamelength = document.getElementById("username").value.length;
  var usernameRegex = /^[a-zA-Z0-9]{5,}$/;

  if (usernamelength < 5) {
    document.getElementById("usernamecheck").innerHTML =
      "<p>Username must contain minimum of 5 character</p>";
  } else {
    userExistence();
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
      } else {
        document.getElementById("usernamecheck").innerHTML = "<p>Unique!!!</p>";
      }
    });
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
      } else {
        document.getElementById("emailcheck").innerHTML = "";
      }
    });
}

function verificationConfirm() {
  var id = localId;
  superagent
    .post("/code")
    .send({ code: document.getElementById("Confirmcode").value, id: id })
    .end(function(err, result) {
      if (err) {
        document.getElementById("verificationcomment").innerHTML =
          "<p>Verification code is incorrect</p>";
      } else {
        var res = JSON.parse(result.text);

        if (res.status) {
          $(document).ready(function() {
            $("#container1").load("/views/home.html", function() {
              trendingTopics(res.trendData);
            });
          });
        }
      }
    });
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

              document.getElementById("welcomeuser").innerHTML=`${localUser.username}`
              yourDiscussion(res.userData);
              if(res.userData.post.length>0){
                postId = res.userData.post[0]._id;
                middleRenderPost(
                  res.userData.username,
                  res.userData.post[0].topic,
                  res.userData.post[0].description,
                  res.userData.post[0].postTime,
                  res.userData.post[0].comments
                );
              }
            

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
        postId = res.userData.post[0]._id;
        $(document).ready(function() {
          $("#discussion-container").load("/views/home.html", function() {

            document.getElementById("welcomeuser").innerHTML=`${localUser.username}`

            middleRenderPost(
              res.userData.username,
              res.userData.post[0].topic,
              res.userData.post[0].description,
              res.userData.post[0].postTime,
              res.userData.post[0].comments
            );
            yourDiscussion(res.userData);
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
              $("#discussion-container").load("/views/home.html", function() {

                document.getElementById("welcomeuser").innerHTML=`${localUser.username}`

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
  console.log("post",posts)

  for(var i=0;i<posts.length;i++){
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
              res.userData.post[i].comments
            );
          }
        }
      }
    });
}

// function renderButtons1(page, numResults, resPerPage) {
//   const pages = Math.ceil(numResults / resPerPage);

//   let button;
//   if (page === 1 && pages > 1) {
//     button = createButton1(page, "next");
//   } else if (page < pages) {
//     button = `${createButton1(page, "prev")}         
//   ${createButton1(page, "next")}`;
//   } else if (page === pages && pages > 1) {
//     button = createButton1(page, "prev");
//   }
//   document
//     .getElementById("Trending__pages")
//     .insertAdjacentHTML("afterbegin", button);
// }

// function createButton1(page, type) {
//   const markup = `
//     <button class="btn-trend results__btn--${type}" data-goto=${
//     type === "prev" ? page - 1 : page + 1
//   }>
//     <span>${type === "prev" ? "Prev" : "Next"}</span>
//     </button>
//     `;
//   return markup;
// }


// MIDDLE RENDERING

function middleRenderPost(username, topic, description, postTime, comments) {

  document.getElementById("post_content").innerHTML = "";
  document.getElementById("comment_content").innerHTML = "";
  var time = calculateTime(postTime);

  const markup = `<h1 style = "white-space:pre"> ${topic}</h1>

  <article class="post"> 
  <h5>posted by ${username}</h5>

  <font size="2">${time}</font></br>
  <font size="4" class="content">
  ${description}
  </font><h4>COMMENTS</h4>`;
  document
    .getElementById("post_content")
    .insertAdjacentHTML("afterbegin", markup);


  for (var i = 0; i < comments.length; i++) {
    const markup1 = `<h4>${comments[i].username}</h4>
    <h5>${comments[i].comment}</h5>`;
    document
      .getElementById("comment_content")
      .insertAdjacentHTML("afterbegin", markup1);
  }
}

// YOUR DISCUSSION TOPIC RENDERING


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
  var posts =postData.post;

  for(var i=0; i<posts.length ;i++){
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
          res.userData.comments
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

function searchBar() {
  var search = document.getElementById("search").value;

  document.getElementById("search").value="";
  //console.log("search text",search);

  superagent
    .post("/search")
    .send({ search: search })
    .end(function(err, result) {
      var res = JSON.parse(result.text);
      postId = res.postData._id;
      middleRenderPost(
        res.username,
        res.postData.topic,
        res.postData.description,
        res.postData.postTime,
        res.postData.comments
      );
    });
}






/*
Go to Main Page 
*/
function homePage() {

  console.log("homepage function called")
  superagent
  .post('/homePage')
  .send({id: localId})
  .end(function( err, result) {
      var res = JSON.parse(result.text);
      if(err){
          console.log(err);
      }
      $(document).ready(function() {
      
       $("#divcontainer").load("../../views/home.html",function(){
        document.getElementById("welcomeuser").innerHTML=`${localUser.username}`
        yourDiscussion(res.userData);
        //postId = res.userData.post[0]._id;
        if(res.userData.post.length > 0){
          middleRenderPost(
            res.userData.username,
            res.userData.post[0].topic,
            res.userData.post[0].description,
            res.userData.post[0].postTime,
            res.userData.post[0].comments
          );
        }
       
        trendingTopics(res.trendData);
       });
      });
      
    });

}



















/////////////////////////////////////////

/////////////////////////////////////////

/////////////////////////////////////////
// function yourDiscussion(postData) {
//   renderPosts(postData.post);
// }

// function renderResults(posts, page, postsPerPage) {
//   document.getElementById("results__pages").addEventListener("click", e => {
//     const btn = e.target.closest(".btn-inline");
//     if (btn) {
// function renderPosts(posts) {
//   //console.log("renderPosts", posts);
//   for(var i=0;i<posts.length;i++){

//   var time = calculateTime(posts[i].postTime);

//   var description = posts[i].description;
//   if (description.length > 40) {
//     description = description.slice(0, 80) + "...";
//   }
//   const markup = `
//   <div class = "template">
//   <a  onclick="getAttributes(this)" class="results__link" href= "#${posts[i]._id}"  style = "color:rgb(199, 247, 255); text-decoration: none;">
//   <article class="topic">
//  <div style="font-size:25px; "> ${posts[i].topic}</div>  <div style="text-align:right;">${time}</div>
//     <p style="font-size:18px;"> 
//     ${description}
//     </p>
//     </article>
//     </a>
//     </div>
// `;
//   document
//     .getElementById("yourdiscussion")
//     .insertAdjacentHTML("beforeend", markup);
// }
// }


// function getAttributes(item) {
//   console.log("item", item);
//   console.log(item.href);

//   var urlArray = item.href.toString().split("#");
//   console.log("href", urlArray[1]);
//   console.log("type", typeof urlArray[1]);
//   var postid = urlArray[1];
//   console.log("Local id", localId);
//   superagent
//     .post("/middleRender")
//     .send({ postId: postid, userId: localId })
//     .end(function(err, result) {
//       if (err) {
//         console.log(error);
//       } else {
//         var res = JSON.parse(result.text);
//         middleRenderPost(
//           res.username,
//           res.userData.topic,
//           res.userData.description,
//           res.userData.postTime
//         );
//       }
//     });
// }
// // function location(item){
// //   location.href = baseURL + item.href;
// //   console.log("location" , location.href)
// // }

// function renderButtons(page, numResults, resPerPage) {
//   const pages = Math.ceil(numResults / resPerPage);
//   console.log(
//     "resultsss",
//     numResults + " " + resPerPage + " " + pages + " " + page
//   );
//   let button;
//   if (page === 1 && pages > 1) {
//     // enable next button only
//     console.log("next button");
//     button = createButton(page, "next");
//     //button=`<button>next</button>`
//   } else if (page < pages) {
//     //Both buttons
//     console.log("both button");
//     button = `${createButton(page, "prev")}         
//   ${createButton(page, "next")}`;
//     //button=`<button>next</button>`
//   } else if (page === pages && pages > 1) {
//     //only previous button
//     console.log("previous button");
//     button = createButton(page, "prev");
//     //button=`<button>next</button>`
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

// function local() {
//   mail = localStorage.getItem("Mail");
//   user = localStorage.getItem("User");
//   password = localStorage.getItem("Password");
//   confirmPass = localStorage.getItem("confirmpassword");
//   if (mail && user && password && confirmPass) {
//     document.getElementById("submit").disabled = false;
//   }
// }

// function calculateTime(postTime) {
//   var currentTime = Date.parse(new Date());
//   var diff = currentTime - postTime;
//   var secs = Math.floor(diff / 1000);
//   var hours = Math.floor(diff / 1000 / 60 / 60);
//   //diff -= hours * 1000 * 60 * 60;
//   var minutes = Math.floor(diff / 1000 / 60);

//   if (hours == 0 && minutes == 0) {
//     if (secs == 0) var time = "Just now";
//     else if (secs == 1) var time = " 1 second ago";
//     else var time = secs + " seconds ago";
//   } else if (hours == 0 && minutes > 0) {
//     if (minutes == 1) {
//       var time = "1 minute ago";
//     }
//     var time = minutes + " minutes ago";
//   } else if (hours > 0) {
//     if (hours === 1) {
//       var time = "1 hour ago";
//     }
//     var time = hours + " hours ago";
//   }

//   return time;
// }

// function addComment() {
//   var comment = document.getElementById("commentBox").value;
//   const markup = `
//   <h2>${comment}</h2>
//   `;
//   document
//     .getElementById("comment_content")
//     .insertAdjacentHTML("afterbegin", markup);
//   var userId = localId;
//   console.log("add comment" + comment + "   " + userId + "   " + postId);
//   superagent
//     .post("/comment")
//     .send({ comment: comment, userId: userId, postId: postId })
//     .end(function(err, result) {});
// }

