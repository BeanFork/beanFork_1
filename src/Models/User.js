var registerUser = function(username, emailid, password) {
    //check for mailid format with the mailidFormat.js in utils
    //check if email already exist in the db -"user" using the validateEmail() function
    // call generateCode function in user.js , passing emailid as argument
  };
  var validateEmail = function(emailid) {
    //check if email exists in db- "user"
  };
  var loginUser = function(username, password) {
    console.log("Login User");
    // if the username and password in db- "user" exists, return true
  
  };
  var generateCode = function(emailid) {
    //generate code
    // store the code in the db "user"
    //send email address and code to a "generateMail" in utils
  };
  
  var userProfile = function(username, emailid, password, typedCode) {
    console.log("User Profile");
    // Call validateCode() and verify the typed code with the verification code in db- "user"
    //If validateCode() returns true, store username , email and hashed password in db
  };
  
  var validateCode = function(codeTyped, emailid) {
    console.log("validateCode");
    // if verification code of corresponding email is same as the typed code and return true
  };
  var updatePassword = function(emailid, password) {
    // update the old password with the new password in the db- "user" with corresponding email.
  };
