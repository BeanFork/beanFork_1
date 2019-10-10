const jwt=require("jsonwebtoken")
require('dotenv').config();
module.exports=(req,res,next)=>{
  
    jwt.verify(req.headers.token, process.env.SECRET_KEY, (err, authData) => {
        
        if (err) {
       next({status:403})
          console.log("jwt error",err)
        } 
        else
        console.log("no errors in jwt");
        next();
})}