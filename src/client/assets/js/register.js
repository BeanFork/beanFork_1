function signup() {
  var Verificationcode = generateCode();
  sendMail(Verificationcode, document.getElementById("email").value);
  superagent
    .post("/signup")
    .send({
      username: document.getElementById("username").value,
      emailid: document.getElementById("email").value,
      password: document.getElementById("password").value,
      code: Verificationcode
    })
    .end(function(err, result) {
      if (err) {
        console.log(err);
      }
      console.log("form data", result.body);
    });
}

function sendMail() {}

function login() {
  superagent
    .post("/login")
    .send({
      username: document.getElementById("loginUsername").value,
      password: document.getElementById("loginPassword").value
    })
    .end(function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("result", result);
      }
    });
}

function forgotpassword() {}

