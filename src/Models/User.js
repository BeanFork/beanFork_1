registerUser = function (username, email, password) {

    //check if email already exist in the db -"user" using the validateEmail function

    // store username , email and hashed password in db (confirm pass) 


}
validateEmail = function (email) {
    //check if email exists in db- "user"

}
loginUser = function (username, password) {

    // if the username and password in db- "user" exists. return true


}
generateCode = function (email) {
    //generate code 

    // store the code in the db "user"

    //send email and code to a "generateMail" in util


}
validateCode = function (codeTyped, email) {

    // if verification code of corresponding email is same as the typed code return true

}
updatePassword = function (email, password) {

    // update the old password with the new password in the db- "user" with corresponding email.
}

