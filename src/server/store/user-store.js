  var userRegistration = function(username,emailid,password){
    //store the username,emailid,password to database
  }
  var validateEmail = function(emailid) {
    //check if email exists in db- "user" returns true
  };
  var loginUser = function(username, password) {
    // if the username and password in db- "user" exists, return true
  
  };
  var saveCode = function(code,userId) {
    // save the code corresponds to the userId
  };
  var updateProfile= function(userId,hashpass){
    //update the password corresponds to the userId
  }
  
  var validateCode = function(codeTyped, emailid) {
    // if verification code of corresponding email is same as the typed code and return true
  };
  var updatePassword = function(emailid, password) {
    // update the old password with the new password in the db- "user" with corresponding email.
  };