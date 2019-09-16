function checkPassword() {
  if (document.getElementById("password").value !== "") {
    if (
      document.getElementById("password").value ===
      document.getElementById("confirmpassword").value
    ) {
      document.getElementById("message").innerHTML = " ";
      localStorage.setItem("confirmpassword",true)
      //document.getElementById("submit").disabled = false;
    } else {
      document.getElementById("message").innerHTML =
        "Must match the previous entry";
        localStorage.setItem("confirmpassword",false)
      //document.getElementById("submit").disabled = true;
    }
  }
}

function passwordStrength() {
  var password = document.getElementById("password").value;
  var strong = new RegExp(
    "^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$"
  );
  var medium = new RegExp(
    "^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$"
  );
  var enough = new RegExp("(?=.{6,}).*");
  if (strong.test(password)) {
    // document.getElementById("password").style.backgroundColor="rgb(133,211,137)";
    document.getElementById("passwordmessage").innerHTML = "<p>STRONG!!!</p>";
    //document.getElementById("submit").disabled=false;
    localStorage.setItem("Password",true)
    
  } else if (medium.test(password)) {
    document.getElementById("passwordmessage").innerHTML = "<p>MEDIUM!!Must contain atleast 8 character that are the combination of letters in both uppercase and lowercase,numbers and symbols</p>";
    // document.getElementById("password").style.backgroundColor="rgb(211,207,125)";
    //document.getElementById("submit").disabled=true;
    localStorage.setItem("Password",false)
  } else if (enough.test(password)) {
    document.getElementById("passwordmessage").innerHTML = "<p>WEAK!!Must contain atleast 8 character that are the combination of letters in both uppercase and lowercase,numbers and symbols</p>";
    // document.getElementById("password").style.backgroundColor="rgb(231,148,148)";
    //document.getElementById("submit").disabled=true;
    localStorage.setItem("Password",false)
  } else {
    document.getElementById("passwordmessage").innerHTML =
      "<p>Enter valid input</p>";
    //document.getElementById("submit").disabled=true;
    localStorage.setItem("Password",false)
  }
}

// function mailidFormat() {
//   var email = document.getElementById("email").value;
//   var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
//   if (reg.test(email) === false) {
//     document.getElementById("idValidation").innerHTML =
//       "<p>Enter valid input</p>";
//       //document.getElementById("submit").disabled=true;
//       localStorage.setItem("Mail",false)
      
//   } else {
//     document.getElementById("idValidation").innerHTML = " ";
//     //document.getElementById("submit").disabled=false;
//     localStorage.setItem("Mail",true)
    
//   }
// }

function generateCode() {
  return Math.random()
    .toString(36)
    .slice(-8);
}

function viewPassword() {
  var x = document.getElementById("password");

  var passStatus = document.getElementById('pass-status');
  if (x.type === "password") {
      x.type = "text";


      passStatus.className = 'fa fa-eye-slash';
  } else {
      x.type = "password";
      passStatus.className = 'fa fa-eye';
  }
}
