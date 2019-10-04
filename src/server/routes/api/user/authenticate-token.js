const jwt=require("jsonwebtoken")
module.exports=(req,res,next)=>{
  console.log("auth token",req.headers.token)
    jwt.verify(req.headers.token, 'secretkeys1', (err, authData) => {
        console.log("auth",authData)
        if (err) {
       next({status:403})
          console.log("jwt error",err)
        } 
        else
        console.log("no errors in jwt");
        next();
})}