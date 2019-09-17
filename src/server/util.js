function verificationCode(){
    return Verificationcode = Math.random()
    .toString(36)
    .slice(-8);
}

function sendMail(verificationcode){
    var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "beanforkaccess@gmail.com",
          pass: "Admin@123"
        }
      });
    
      transporter.sendMail(
        {
          from: "beanforkaccess@gmail.com",
          to: req.body.email,
          subject: "Forgot Password",
          text: "Verification code is " + verificationcode
        },
        function (err) {
          if (err) console.log(err);
        }
      );
}
module.exports= {
    verificationCode : verificationCode,
    sendMail : sendMail
}