var localUser;
var localId;
var postId;
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
        if (res.status) {
          signupVerification(res.email);
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
        //localStorage.setItem("localId", res.id);
      }
    });
}

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
        // localStorage.setItem('localId',res.id);
        //   $("html").html(res.html);
        localUser = res.userData;
        console.log("local user", localUser);
        localId = res.userData._id;
        if (res.status) {
          $(document).ready(function() {
            $("#container1").load("/views/home.html", function() {
              console.log("load is performed");
              console.log("Hello" + res.username);

              yourDiscussion(res.userData);
              middleRenderPost(res.userData);
            });
          });
        }
      }
    });
}

function forgotPassword() {
  superagent.post("/forgotPassword").end(function(err, result) {
    if (err) {
      console.log(err);
    }

    if (result.status) {
      $(document).ready(function() {
        $("#container1").load("/views/forgot-password.html", function() {
          console.log("load is performed");
        });
      });
    }
  });
}

function mailidFormat() {
  var email = document.getElementById("email").value;
  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if (reg.test(email) === false) {
    document.getElementById("idValidation").innerHTML =
      "<p>Enter valid input</p>";
    //document.getElementById("submit").disabled=true;
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
      //console.log("this is result", result);
      var res = JSON.parse(result.text);
      //console.log(res);
      if (res.status) {
        document.getElementById("usernamecheck").innerHTML =
          "<p>Username already exists</p>";
        localStorage.setItem("User", false);
      } else {
        document.getElementById("usernamecheck").innerHTML = "<p>Unique!!!</p>";
        localStorage.setItem("User", true);
      }
    });
}

function emailExistence() {
  superagent
    .post("/email")
    .send({ email: document.getElementById("email").value })
    .end(function(err, result) {
      var res = JSON.parse(result.text);
      //console.log(res);
      if (res.status) {
        document.getElementById("emailcheck").innerHTML =
          "<p>Email already exists</p>";
        localStorage.setItem("Mail", false);
      } else {
        document.getElementById("emailcheck").innerHTML = "";
        localStorage.setItem("Mail", true);
        local();
      }
    });
}

function verificationConfirm() {
  //var id = localStorage.getItem("localId");
  var id = localId;
  //console.log(document.getElementById("Confirmcode").value);
  superagent
    .post("/code")
    .send({ code: document.getElementById("Confirmcode").value, id: id })
    .end(function(err, result) {
      if (err) {
        document.getElementById("verificationcomment").innerHTML =
          "<p>Verification code is incorrect</p>";
      } else {
        //$("html").html(result.text);
        var res = JSON.parse(result.text);
        if (res.status) {
          $(document).ready(function() {
            $("#container1").load("/views/home.html", function() {
              console.log("load is performed");
              document.getElementById(
                "welcomeuser"
              ).innerHTML = `<p>Welcome ${res.username}</p>`;
            });
          });
        }
      }
    });
}

function newDiscussion() {
  superagent.post("/newdiscussion").end(function(err, result) {
    var res = JSON.parse(result.text);

    if (res.status) {
      $(document).ready(function() {
        $("#container1").load("/views/new-discussion.html", function() {
          console.log("load is performed");
          console.log("Hello" + res.username);
          document.getElementById(
            "welcomeuser"
          ).innerHTML = `<p>Welcome ${localUser.username}</p>`;
        });
      });
    }
  });
}

function createDiscussion() {
  var topic = document.getElementById("discussionTopic").value;
  var description = document.getElementById("discussionDescription").value;
  var postTime = Date.parse(new Date());
  console.log("topic", topic.length);
  console.log("description", description.length);
  var id = localId;
  if (topic.length > 0 && description.length > 0) {
    superagent
      .post("/creatediscussion")
      .send({
        topic: topic,
        description: description,
        id: id,
        postTime: postTime
      })
      .end(function(err, result) {
        if (err) {
          console.log("it is error", err);
        } else {
          var res = JSON.parse(result.text);
          localUser = res.postData;
          //console.log("rendering",res)
          //renderpost(res.postData)
          // postData = res.postData;
          // console.log("global postData",postData)
          if (res.status) {
            try {
              $(document).ready(function() {
                $("#discussion-container").load("/views/home.html", function() {
                  console.log("load is performed");
                  middleRenderPost(res.postData);
                  yourDiscussion(res.postData);
                  //renderResults(res.postData.post)
                });
              });
            } catch (e) {
              console.log(e);
            }
            //jsonRes = res.postdata;
          }
        }
      });
  } else
    document.getElementById("discussion").innerHTML =
      "<p>***Both the fields are mandatory</p>";
}

// function renderpost(postdata) {
//   console.log("helllo");
//   console.log("render", postdata.post[0].topic);
//   const markup = `<h1>${postdata.post[0].topic}</h1>
//   <article class="post">
//     <h3>${postdata.username}</h3>
//     <font size="2">Posted 3 hrs ago</font></br>
//     <font size="4" class="content">
//       ${postdata.post[0].description}
//     </font>`;
//   document
//     .getElementById("post_content")
//     .insertAdjacentHTML("afterbegin", markup);
//   //document.getElementById("post_content").innerHTML="<p>It is working</p>"
//   //console.log(jsonRes);
// }

function middleRenderPost(postData) {
  postId = postData.post[0]._id;
  var time = calculateTime(postData.post[0].postTime);
  console.log("render", postData.post[0].topic);
  const markup = `<h1>${postData.post[0].topic}</h1>
  <article class="post">
  <h3>${postData.username}</h3>
  <font size="2">${time}</font></br>
  <font size="4" class="content">
  ${postData.post[0].description}
  </font>`;
  document
    .getElementById("post_content")
    .insertAdjacentHTML("afterbegin", markup);
  //document.getElementById("post_content").innerHTML="<p>It is working</p>"
  //console.log(jsonRes);
}

function yourDiscussion(postData) {
  renderResults(postData.post, 1, 5);
}

function renderResults(posts, page, postsPerPage) {
  document.getElementById("results__pages").addEventListener("click", e => {
    const btn = e.target.closest(".btn-inline");
    if (btn) {
      const gotoPage = parseInt(btn.dataset.goto, 10);
      document.getElementById("yourdiscussion").innerHTML = "";
      document.getElementById("results__pages").innerHTML = "";
      renderResults(localUser.post, gotoPage, 5);
      discussionPage = gotoPage;
      console.log("button", gotoPage);
    }
  });
  if (posts.length > postsPerPage) {
    const starting = (page - 1) * postsPerPage;
    const ending = page * postsPerPage;
    console.log("start", posts.slice(starting, ending));

    posts.slice(starting, ending).forEach(renderPosts);
    renderButtons(page, posts.length, postsPerPage);
  }
  else{
    const starting = (page - 1) * postsPerPage;
    const ending = page * postsPerPage;
    console.log("start", posts.slice(starting, ending));

    posts.slice(starting, ending).forEach(renderPosts);
  }
}

function renderPosts(posts) {
  //console.log("renderPosts", posts);
  // for(var i=0;i<posts.length;i++){

  var time = calculateTime(posts.postTime);

  var description = posts.description;
  if (description.length > 40) {
    description = description.slice(0, 80) + "...";
  }
  const markup = `
  <a class="results__link" href= "#${posts._id}"
  <article class="topic">
    <h2>${posts.topic}</h2>
    <h4>${time}</h4>
    <p>
    ${description}
    </p>
    </article>
    </a>
`;
  document
    .getElementById("yourdiscussion")
    .insertAdjacentHTML("beforeend", markup);
}

function renderButtons(page, numResults, resPerPage) {
  const pages = Math.ceil(numResults / resPerPage);
  console.log(
    "resultsss",
    numResults + " " + resPerPage + " " + pages + " " + page
  );
  let button;
  if (page === 1 && pages > 1) {
    // enable next button only
    console.log("next button");
    button = createButton(page, "next");
    //button=`<button>next</button>`
  } else if (page < pages) {
    //Both buttons
    console.log("both button");
    button = `${createButton(page, "prev")}         
  ${createButton(page, "next")}`;
    //button=`<button>next</button>`
  } else if (page === pages && pages > 1) {
    //only previous button
    console.log("previous button");
    button = createButton(page, "prev");
    //button=`<button>next</button>`
  }
  document
    .getElementById("results__pages")
    .insertAdjacentHTML("afterbegin", button);
}

function createButton(page, type) {
  const markup = `
    <button class="btn-inline results__btn--${type}" data-goto=${
    type === "prev" ? page - 1 : page + 1
  }>
    <span> ${type === "prev" ? "Prev" : "Next"}</span>
    </button>
    `;
  return markup;
}

function local() {
  mail = localStorage.getItem("Mail");
  user = localStorage.getItem("User");
  password = localStorage.getItem("Password");
  confirmPass = localStorage.getItem("confirmpassword");
  if (mail && user && password && confirmPass) {
    document.getElementById("submit").disabled = false;
  }
}

function calculateTime(postTime) {
  var currentTime = Date.parse(new Date());
  var diff = currentTime - postTime;
  var secs = Math.floor(diff / 1000);
  var hours = Math.floor(diff / 1000 / 60 / 60);
  //diff -= hours * 1000 * 60 * 60;
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


function addComment(){
  var comment = document.getElementById("commentBox").value;
  const markup = `
  <h2>${comment}</h2>
  `
  document.getElementById("comment_content").insertAdjacentHTML("afterbegin",markup);
  var userId =localId;
  console.log("add comment"+ comment+"   "+userId+"   "+postId)
  superagent
  .post("/comment")
  .send({comment : comment, userId : userId,postId : postId})
  .end(function(err,result){

  })
}
