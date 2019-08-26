var registerUser = function(username, emailid, password) {
  //check for mailid format with the mailidFormat() in util.js
  //check if email already exist in the db -"user" using the validateEmail() function in store/user-store.js
  // call generateCode function in user.js , passing emailid,userid as argument
  //call userRegistration function in store/user-store.js
};
var generateCode = function(emailid) {
  //generate code
  // call saveCode function in store/user-store.js
  //call generateMail function in util.js
};

var userProfile = function(userId, emailid, password, typedCode) {
  // Call validateCode() in store/user-store.js if it returns true
  //then call updateProfile() in store/user-store.js
};
