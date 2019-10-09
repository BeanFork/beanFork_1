const jwt=require("jsonwebtoken")
require('dotenv').config();
module.exports=(req,res,next)=>{
  console.log("auth token",req.headers.token)
    jwt.verify(req.headers.token, process.env.SECRET_KEY, (err, authData) => {
        console.log("auth",authData)
        console.log("enc",process.env.SECRET_KEY) 
        if (err) {
       next({status:403})
          console.log("jwt error",err)
        } 
        else
        console.log("no errors in jwt");
        next();
})}