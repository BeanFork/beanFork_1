var nodeMailer = require("nodemailer"); 
//Generation of Verification code and sending the mail 
function sendMail(email){
     verificationCode = Math.random()
    .toString(36)
    .slice(-8);
// Sending mail    
    var transporter = nodeMailer.createTransport({
        service: "Gmail",
        auth: {
          user: "beanforkaccess@gmail.com",
          pass: "Admin@123"
        }
      });
    
      transporter.sendMail(
        {
          from: "beanforkaccess@gmail.com",
          to: email,
          subject: "Verification Code for Reset Password",
          text: "Verification code is " + verificationCode
        },
        function (err) {
          if (err) console.log(err);
        }
      );
      return verificationCode;
}
module.exports= {
    sendMail : sendMail
}