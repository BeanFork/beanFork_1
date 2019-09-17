var localUser;
var localid;
function signup() {
  // sendMail(Verificationcode, document.getElementById("email").value);
  // var data="<input type='text' name='name'> ";

  // document.getElementById("signupcontainer").innerHTML=data

  var username = document.getElementById("username").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  document.getElementById("signupcontainer").classList.add("hide");
  //localStorage.setItem('localemail1',email);

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
          signupverification(res.email);
        }
      }
    });
}
function signupverification(email) {
  console.log("email", email);
  superagent
    .post("/signupverification")
    .send({ email: email })
    .end(function(err, result) {
      if (err) {
        console.log(err);
      } else {
        var res = JSON.parse(result.text);
        localid = res.id;
        //localStorage.setItem("localid", res.id);
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
        // localStorage.setItem('localid',res.id);
        //   $("html").html(res.html);
        localUser = res.userData;
        console.log("local user", localUser);
        localid = res.userData._id;
        if (res.status) {
          $(document).ready(function() {
            $("#container1").load("/views/home.html", function() {
              console.log("load is performed");
              console.log("Hello" + res.username);
              document.getElementById(
                "welcomeuser"
              ).innerHTML = `<p>Welcome ${localUser.username}</p>`;
            });
          });
        }
      }
    });
}

function forgotpassword() {
  superagent.post("/forgotpassword").end(function(err, result) {
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

function cancelSignup() {
  document.getElementById("confirmpassword").value = "";
  document.getElementById("username").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
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

function UsernameLength() {
  var usernamelength = document.getElementById("username").value.length;
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

function verificationconfirm() {
  //var id = localStorage.getItem("localid");
  var id = localid;
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
        if (result.status) {
          $(document).ready(function() {
            $("#container1").load("/views/home.html", function() {
              console.log("load is performed");
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
  var posttime = Date.parse(new Date());
  console.log("topic", topic.length);
  console.log("description", description.length);
  var id = localid;
  if (topic.length > 0 && description.length > 0) {
    superagent
      .post("/creatediscussion")
      .send({
        topic: topic,
        description: description,
        id: id,
        posttime: posttime
      })
      .end(function(err, result) {
        if (err) {
          console.log("it is error", err);
        } else {
          var res = JSON.parse(result.text);
          //console.log("rendering",res)
          //renderpost(res.postdata)
          if (res.status) {
            //    try{
            //       $(document).ready(function() {
            //         $("#container1").load("/views/home.html", function() {
            //     });
            // })}
            // catch(e){
            //   console.log(e)
            // }

            document.getElementById(
              "welcomeuser"
            ).innerHTML = `<p>Welcome ${localUser.username}</p>`;
            try {
              $("html").html(res.html);
            } catch (e) {
              console.log(e);
            }
            //jsonRes = res.postdata;
            middleRenderPost(res.postdata);
            yourDiscussion(res.postdata);
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

function middleRenderPost(postdata) {
  console.log("render", postdata.post[0].topic);
  const markup = `<h1>${postdata.post[0].topic}</h1>
  <article class="post">
  <h3>${postdata.username}</h3>
  <font size="2">Posted 3 hrs ago</font></br>
  <font size="4" class="content">
  ${postdata.post[0].description}
  </font>`;
  document
    .getElementById("post_content")
    .insertAdjacentHTML("afterbegin", markup);
  //document.getElementById("post_content").innerHTML="<p>It is working</p>"
  //console.log(jsonRes);
}

function yourDiscussion(postdata) {
  renderResults(postdata.post, 1, 5);
}

function renderResults(posts, page = 2, postsperpage) {
  const starting = (page - 1) * postsperpage;
  const ending = page * postsperpage;
  console.log("start", posts.slice(starting, ending));

  posts.slice(starting, ending).forEach(renderPosts);
  renderButtons(page, posts.length, postsperpage);
}

function renderPosts(posts) {
  console.log("renderPosts", posts);
  // for(var i=0;i<posts.length;i++){
  var description = posts.description;
  if (description.length > 40) {
    description = description.slice(0, 20) + "...";
  }
  const markup = `<article class="topic">
    <h2>${posts.topic}</h2>
    <h4>Published Time</h4>
    <p>
    ${description}
    </p>
    </article>`;
  document
    .getElementById("yourdiscussion")
    .insertAdjacentHTML("afterbegin", markup);
}

function renderButtons(page, numResults, resperpage) {
  const pages = Math.ceil(numResults / resperpage);
  console.log(
    "resultsss",
    numResults + " " + resperpage + " " + pages + " " + page
  );
  let button;
  if (page === 1 && pages > 1) {
    // enable next button only
    console.log("next button");
    button = createbutton(page, "next");
    //button=`<button>next</button>`
  } else if (page < pages) {
    //Both buttons
    console.log("both button");
    button = `${createbutton(page, "prev")};
  ${createbutton(page, "next")};`;
    //button=`<button>next</button>`
  } else if (page === pages && pages > 1) {
    //only previous button
    console.log("previous button");
    button = createbutton(page, "prev");
    //button=`<button>next</button>`
  }
  document
    .getElementById("results__pages")
    .insertAdjacentHTML("afterbegin", button);
}

function createbutton(page, type) {
  const markup = `
    <button class="btn-inline results__btn--${type}" data-goto=${
    type === "prev" ? page - 1 : page + 1
  }>
    <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
    </button>
    `;
  return markup;
}

function local() {
  mail = localStorage.getItem("Mail");
  user = localStorage.getItem("User");
  password = localStorage.getItem("Password");
  confirmpass = localStorage.getItem("confirmpassword");
  if (mail && user && password && confirmpass) {
    document.getElementById("submit").disabled = false;
  }
}
