function signup() {
  var Verificationcode = generateCode();
  // sendMail(Verificationcode, document.getElementById("email").value);
  // var data="<input type='text' name='name'> ";

  // document.getElementById("signupcontainer").innerHTML=data

  var username = document.getElementById("username").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  //   document.getElementById("confirmpassword").value = "";
  //   document.getElementById("username").value = "";
  //   document.getElementById("email").value = "";
  //   document.getElementById("password").value = "";
  //   document.getElementById("submit").style.visibility = 'hidden';
  //   document.getElementById("cancel").style.visibility = 'hidden';
  // document.getElementById("confirm").style.visibility = 'visible';
  document.getElementById("signupcontainer").classList.add("hide");

  document.getElementById("signupcontainer").classList.remove("show");
  // var h1 = document.createElement('h1');
  // h1.innerHTML = document.getElementById("new").innerHTML;
  document.getElementById("new1").classList.add("show");
  document.getElementById("new1").classList.remove("hide");
  // var container=document.getElementById("signupcontainer");
  // container.innerHTML="<p>Helllo</p>"
  superagent
    .post("/signup")
    .send({
      username: username,
      email: email,
      password: password,
      code: Verificationcode
    })
    .end(function(err, result) {
      if (err) {
        console.log(err);
      } else {
        //   document.getElementById("verificationfield").innerHTML="<input class="form-control input-lg" id="confirmpassword" type="password" placeholder="Confirm Password"
        //   onkeyup="checkPassword()"
        //   size="80"
        //   required
        // />"
        // var div1 =document.createElement("div");
        // div1.innerHTML=document.getElementById("new1").innerHTML;
        // document.getElementById("new").appendChild(div1);
        // document.getElementById("otpalert").innerHTML ="<p>Enter the OTP send to the registered MailId</p>"
        // var res = JSON.parse(result.text);
        // console.log(res);
        // if (res.status && res.type === "emailuser") {
        //   document.getElementById("verificationfield").innerHTML =
        //     "<p>Email and Username already exists</p>";
        // } else if (res.result && res.type === "user") {
        //   document.getElementById("verificationfield").innerHTML =
        //     "<p>UserName already exists</p>";
        // } else if (res.result && res.type === "email") {
        //   document.getElementById("verificationfield").innerHTML =
        //     "<p>EmailId already exists</p>";
        // }
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
      } else {
        var res = JSON.parse(result.text);
        if (!res.state) {
          $("html").html(res.html);
        } else {
          document.getElementById("loginverification").innerHTML =
            "<p>Username or password is incorrect</p>";
        }
      }
    });
}

function forgotpassword() {
  superagent.post("/forgotpassword").end(function(err, result) {
    if (err) {
      console.log(err);
    }
    $("html").html(result.text);
  });
}

function cancelSignup() {
  document.getElementById("confirmpassword").value = "";
  document.getElementById("username").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
}

function userExistence() {
  superagent
    .post("/user")
    .send({
      username: document.getElementById("username").value
    })
    .end(function(err, result) {
      console.log("this is result", result);
      var res = JSON.parse(result.text);
      console.log(res);
      if (res.status) {
        document.getElementById("usernamecheck").innerHTML =
          "<p>Username already exists</p>";
      } else {
        document.getElementById("usernamecheck").innerHTML = "";
      }
    });
}

function emailExistence() {
  superagent
    .post("/email")
    .send({ email: document.getElementById("email").value })
    .end(function(err, result) {
      var res = JSON.parse(result.text);
      console.log(res);
      if (res.status) {
        document.getElementById("emailcheck").innerHTML =
          "<p>Email already exists</p>";
      } else {
        document.getElementById("emailcheck").innerHTML = "";
      }
    });
}
