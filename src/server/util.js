function verificationCode(){
    return Verificationcode = Math.random()
    .toString(36)
    .slice(-8);
}
module.exports=verificationCode();
