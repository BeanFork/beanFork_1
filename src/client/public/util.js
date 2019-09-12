function checkPassword() {
  if (document.getElementById("password").value !== "") {
    if (
      document.getElementById("password").value ==
      document.getElementById("confirmpassword").value
    ) {
      document.getElementById("message").innerHTML = " ";
      document.getElementById("submit").disabled = false;
    } else {
      document.getElementById("message").innerHTML =
        "Must match the previous entry";
      document.getElementById("submit").disabled = true;
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
    
  } else if (medium.test(password)) {
    document.getElementById("passwordmessage").innerHTML = "<p>MEDIUM!!Must contain atleast 8 character that are the combination of letters in both uppercase and lowercase,numbers and symbols</p>";
    // document.getElementById("password").style.backgroundColor="rgb(211,207,125)";
  } else if (enough.test(password)) {
    document.getElementById("passwordmessage").innerHTML = "<p>WEAK!!Must contain atleast 8 character that are the combination of letters in both uppercase and lowercase,numbers and symbols</p>";
    // document.getElementById("password").style.backgroundColor="rgb(231,148,148)";
  } else {
    document.getElementById("passwordmessage").innerHTML =
      "<p>Enter valid input</p>";
      document.getElementById("submit").disabled=true;
  }
}

function mailidFormat() {
  var email = document.getElementById("email").value;
  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if (reg.test(email) === false) {
    document.getElementById("idValidation").innerHTML =
      "<p>Enter valid input</p>";
      document.getElementById("submit").disabled=true;
      
  } else {
    document.getElementById("idValidation").innerHTML = " ";
    
  }
}

function generateCode() {
  return Math.random()
    .toString(36)
    .slice(-8);
}
